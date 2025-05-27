<?php

declare(strict_types=1);

namespace Neos\DocsNeosIo\Service;


use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Exception\WorkspaceDoesNotExist;
use Neos\ContentRepository\Core\SharedModel\Workspace\Workspace;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Configuration\Exception\InvalidConfigurationException;
use Neos\Flow\Http\Client\Browser;
use Neos\Flow\Http\Client\CurlEngine;
use Neos\Flow\Log\Utility\LogEnvironment;
use Neos\Http\Factories\ServerRequestFactory;
use Neos\Http\Factories\StreamFactory;
use Neos\Neos\Domain\Model\WorkspaceClassification;
use Neos\Neos\Domain\Model\WorkspaceRole;
use Neos\Neos\Domain\Repository\WorkspaceMetadataAndRoleRepository;
use Neos\Neos\Domain\Service\UserService;
use Neos\Neos\Domain\Service\WorkspaceService;
use Psr\Http\Client\ClientExceptionInterface;
use Psr\Log\LoggerInterface;

#[Flow\Scope("singleton")]
class NotifierService
{
    #[Flow\Inject]
    protected LoggerInterface $systemLogger;

    #[Flow\InjectConfiguration(path: 'http.baseUri', package: 'Neos.Flow')]
    protected ?string $baseUri;

    #[Flow\InjectConfiguration(path: 'notify', package: 'Neos.DocsNeosIo')]
    protected ?array $notifySettings;

    #[Flow\InjectConfiguration(path: 'slack', package: 'Neos.DocsNeosIo')]
    protected ?array $slackSettings;

    protected bool $notificationHasBeenSentInCurrentInstance = false;

    public function __construct(
        private ContentRepositoryRegistry $contentRepositoryRegistry,
        private WorkspaceService          $workspaceService,
        private UserService               $userService,
        private ServerRequestFactory      $serverRequestFactory,
        private StreamFactory             $streamFactory
    )
    {
    }

    /**
     * Send out a Slack message for a change in a workspace.
     *
     * @throws InvalidConfigurationException
     */
    protected function sendSlackMessages(WorkspaceName $targetWorkspaceName): void
    {
        if (!$this->slackSettings['enabled']) {
            return;
        }

        if (empty($this->slackSettings['postTo'])) {
            throw new InvalidConfigurationException('The NotifierService slack.postTo configuration expects at least one target if enabled.', 1748330839);
        }

        $currentUser = $this->userService->getCurrentUser();
        $currentUserName = $currentUser?->getLabel() ?: $currentUser->getId();
        $reviewUrl = sprintf('%1$s/neos/management/workspace?moduleArguments[@package]=neos.workspace.ui&moduleArguments[@controller]=workspace&moduleArguments[@action]=review&moduleArguments[@format]=html&moduleArguments[workspace]=%2$s', $this->baseUri, $targetWorkspaceName->jsonSerialize());
        $message = sprintf($this->slackSettings['message'], $currentUserName, $targetWorkspaceName, $reviewUrl);

        foreach ($this->slackSettings['postTo'] as $postToKey => $postTo) {
            if (empty($postTo['webhookUrl']) || !filter_var($postTo['webhookUrl'], FILTER_VALIDATE_URL)) {
                throw new InvalidConfigurationException('Configuration error: The slack.postTo ' . $postToKey . ' requires a valid webhookUrl.');
            }

            try {
                $browser = new Browser();
                $engine = new CurlEngine();
                $engine->setOption(CURLOPT_TIMEOUT, 0);
                $browser->setRequestEngine($engine);

                $requestBody = ["text" => $message];

                $slackRequest = $this->serverRequestFactory->createServerRequest('POST', $postTo['webhookUrl'])
                    ->withHeader('Content-Type', 'application/json')
                    ->withBody($this->streamFactory->createStream(json_encode($requestBody)));

                $browser->sendRequest($slackRequest);
            } catch (ClientExceptionInterface) {
                $this->systemLogger->warning(sprintf('Could not send message to Slack webhook %s with message "%s"', $postTo['webhookUrl'], $message), LogEnvironment::fromMethodName(__METHOD__));
            }
        }
    }

    /**
     * Notify about a workspace changes when the given workspace matches the configured workspaceNamePattern, is a
     * shared workspace and has the live workspace as base workspace.
     *
     * This method will only send a notification once per instance, even if multiple nodes are to be published.
     *
     * @throws InvalidConfigurationException
     */
    public function notify(WorkspaceName $targetWorkspaceName, ContentRepositoryId $contentRepositoryId): void
    {
        if (!$this->notifySettings['enabled']) {
            return;
        }

        // skip sending another notification if more than one node is to be published
        if ($this->notificationHasBeenSentInCurrentInstance) {
            return;
        }

        // skip if the workspace name does not match the configured pattern
        if (preg_match($this->notifySettings['workspaceNamePattern'], $targetWorkspaceName->value)) {
            return;
        }

        // skip changes to shared workspace that does not target live
        if ($this->isSharedWorkspace($targetWorkspaceName, $contentRepositoryId) && !$this->isTargetLiveWorkspace($targetWorkspaceName, $contentRepositoryId)) {
            return;
        }

        if (preg_match($this->notifySettings['workspaceNamePattern'], $targetWorkspaceName->value)) {
            $this->sendSlackMessages($targetWorkspaceName);
            $this->notificationHasBeenSentInCurrentInstance = true;
        }
    }

    /**
     * Checks if the base workspace is not the live workspace
     *
     * @throws WorkspaceDoesNotExist
     */
    protected function isTargetLiveWorkspace(WorkspaceName $workspaceName, ContentRepositoryId $contentRepositoryId): bool
    {
        $workspace = $this->getWorkspaceByName($contentRepositoryId, $workspaceName);
        if (!$workspace->baseWorkspaceName->equals(WorkspaceName::forLive())) {
            return false;
        }

        return true;
    }

    /**
     * Checks if the workspace is a shared workspace
     *
     * @throws WorkspaceDoesNotExist
     */
    protected function isSharedWorkspace(WorkspaceName $workspaceName, ContentRepositoryId $contentRepositoryId): bool
    {
        $workspaceMetadata = $this->workspaceService->getWorkspaceMetadata($contentRepositoryId, $workspaceName);
        $workspaceRoleAssignments = $this->workspaceService->getWorkspaceRoleAssignments($contentRepositoryId, $workspaceName);
        $this->systemLogger->debug(sprintf('Checking if workspace "%s" in content repository "%s" is shared', $workspaceName->value, $contentRepositoryId->value), LogEnvironment::fromMethodName(__METHOD__));
        $this->systemLogger->debug(json_encode($workspaceMetadata, JSON_PRETTY_PRINT), LogEnvironment::fromMethodName(__METHOD__));
        $isShared = false;
        if ($workspaceMetadata->classification === WorkspaceClassification::SHARED) {
            foreach ($workspaceRoleAssignments as $roleAssignment) {
                if ($roleAssignment->role === WorkspaceRole::COLLABORATOR) {
                    $isShared = true;
                }
            }
        }
        return $isShared;
    }

    /**
     * Returns workspace by the given name in the given content repository.
     *
     * @throws WorkspaceDoesNotExist if the workspace does not exist
     */
    protected function getWorkspaceByName(ContentRepositoryId $contentRepositoryId, WorkspaceName $workspaceName): Workspace
    {
        $workspace = $this->contentRepositoryRegistry
            ->get($contentRepositoryId)
            ->findWorkspaceByName($workspaceName);
        if ($workspace === null) {
            throw WorkspaceDoesNotExist::butWasSupposedToInContentRepository($workspaceName, $contentRepositoryId);
        }
        return $workspace;
    }
}
