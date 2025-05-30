<?php

namespace Neos\DocsNeosIo\CatchUpHook;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Core\Projection\CatchUpHook\CatchUpHookFactoryDependencies;
use Neos\ContentRepository\Core\Projection\CatchUpHook\CatchUpHookFactoryInterface;
use Neos\ContentRepository\Core\Projection\CatchUpHook\CatchUpHookInterface;
use Neos\DocsNeosIo\Service\NotifierService;

class WorkspacePublishHookFactory implements CatchUpHookFactoryInterface
{
    #[Flow\InjectConfiguration()]
    protected array $configuration;

    public function __construct(
        private readonly NotifierService $notifierService,
    )
    {
    }

    public function build(CatchUpHookFactoryDependencies $dependencies): CatchUpHookInterface
    {
        return new WorkspacePublishHook(
            $dependencies->contentRepositoryId,
            $this->notifierService,
            $this->configuration['notify']['general']['enabled'] ?? false
        );
    }
}
