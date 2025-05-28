<?php

namespace Neos\DocsNeosIo\CatchUpHook;

use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\Subscription\SubscriptionStatus;
use Neos\DocsNeosIo\Service\NotifierService;
use Neos\ContentRepository\Core\EventStore\EventInterface;
use Neos\ContentRepository\Core\Feature\WorkspacePublication\Event\WorkspaceWasPartiallyPublished;
use Neos\ContentRepository\Core\Feature\WorkspacePublication\Event\WorkspaceWasPublished;
use Neos\ContentRepository\Core\Projection\CatchUpHook\CatchUpHookInterface;
use Neos\EventStore\Model\EventEnvelope;
use Neos\Flow\Configuration\Exception\InvalidConfigurationException;

class WorkspacePublishHook implements CatchUpHookInterface
{
    protected bool $handleEvents = false;

    public function __construct(
        private readonly ContentRepositoryId $contentRepositoryId,
        private readonly NotifierService     $notifierService,
        private readonly bool                $enabledNotifier = true,
    )
    {
    }

    public function onBeforeCatchUp(SubscriptionStatus $subscriptionStatus): void
    {
        if ($subscriptionStatus === SubscriptionStatus::ACTIVE && $this->enabledNotifier === true) {
            $this->handleEvents = true;
            return;
        }

        $this->handleEvents = false;
    }

    public function onBeforeEvent(EventInterface $eventInstance, EventEnvelope $eventEnvelope): void
    {
        // Nothing to do here
    }

    public function onAfterEvent(EventInterface $eventInstance, EventEnvelope $eventEnvelope): void
    {
        if ($this->handleEvents === false) {
            return;
        }

        match ($eventInstance::class) {
            WorkspaceWasPublished::class => $this->sendNotification($eventInstance),
            WorkspaceWasPartiallyPublished::class => $this->sendNotification($eventInstance),
            default => null
        };
    }

    public function onAfterBatchCompleted(): void
    {
        if ($this->handleEvents === false) {
            return;
        }
    }

    public function onAfterCatchUp(): void
    {
        // Nothing to do here
    }

    /**
     * @throws InvalidConfigurationException
     */
    private function sendNotification(EventInterface $event): void
    {
        if ($this->enabledNotifier === false) {
            return;
        }

        /** @var WorkspaceWasPublished|WorkspaceWasPartiallyPublished $event */
        $this->notifierService->notify($event->targetWorkspaceName, $this->contentRepositoryId);
    }
}
