<?php

declare(strict_types=1);

namespace Neos\DocsNeosIo\Service;


use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Workspace\Workspace;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
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

    #[Flow\Inject]
    protected UserService $userService;

    #[Flow\Inject]
    protected WorkspaceService $workspaceService;

    #[Flow\Inject]
    protected WorkspaceMetadataAndRoleRepository $metadataAndRoleRepository;

    #[Flow\Inject]
    protected ServerRequestFactory $serverRequestFactory;

    #[Flow\Inject]
    protected StreamFactory $streamFactory;

    #[Flow\InjectConfiguration(path: 'http.baseUri', package: 'Neos.Flow')]
    protected ?string $baseUri;

    #[Flow\InjectConfiguration(path: 'notify', package: 'Neos.DocsNeosIo')]
    protected ?array $notifySettings;

    #[Flow\InjectConfiguration(path: 'slack', package: 'Neos.DocsNeosIo')]
    protected ?array $slackSettings;

    protected bool $notificationHasBeenSentInCurrentInstance = false;

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
                throw new InvalidConfigurationException('The CodeQ.PublishNotifier slack.postTo ' . $postToKey . ' requires a valid webhookUrl.');
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
     * @throws InvalidConfigurationException
     */
    public function notify(WorkspaceName $targetWorkspaceName, ContentRepositoryId $contentRepositoryId): void
    {
        // skip sending another notification if more than one node is to be published
        if ($this->notificationHasBeenSentInCurrentInstance) {
            return;
        }

        // skip changes to personal workspace
        if ($this->isPersonalWorkspace($targetWorkspaceName, $contentRepositoryId)) {
            return;
        }

        // skip changes to shared workspace
        if (!$this->notifySettings['sharedWorkspace'] && $this->isSharedWorkspace($targetWorkspaceName, $contentRepositoryId)) {
            return;
        }

        $this->sendSlackMessages($targetWorkspaceName);
        $this->notificationHasBeenSentInCurrentInstance = true;
    }

    protected function isSharedWorkspace(WorkspaceName $workspaceName, ContentRepositoryId $contentRepositoryId): bool
    {
        $workspaceMetadata = $this->workspaceService->getWorkspaceMetadata($contentRepositoryId, $workspaceName);
        $workspaceRoleAssignments = $this->workspaceService->getWorkspaceRoleAssignments($contentRepositoryId, $workspaceName);
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

    protected function isPersonalWorkspace(WorkspaceName $workspaceName, ContentRepositoryId $contentRepositoryId): bool
    {
        $currentUser = $this->userService->getCurrentUser();
        $existingWorkspaceName = $this->metadataAndRoleRepository->findWorkspaceNameByUser($contentRepositoryId, $currentUser->getId());
        return $existingWorkspaceName !== null && $existingWorkspaceName->equals($workspaceName);
    }
}
