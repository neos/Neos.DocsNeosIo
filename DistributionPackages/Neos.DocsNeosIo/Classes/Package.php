<?php

namespace Neos\DocsNeosIo;

use Neos\DocsNeosIo\Service\WorkspaceService;
use Neos\Flow\Core\Bootstrap;
use Neos\Flow\Package\Package as BasePackage;
use Neos\Flow\Security\Authentication\AuthenticationProviderManager;
use Neos\Neos\Domain\Service\UserService;

class Package extends BasePackage
{
    /**
     * @param Bootstrap $bootstrap The current bootstrap
     * @return void
     */
    public function boot(Bootstrap $bootstrap)
    {
        $dispatcher = $bootstrap->getSignalSlotDispatcher();
        //$dispatcher->connect(AuthenticationProviderManager::class, 'successfullyAuthenticated', WorkspaceService::class, 'createReviewWorkspaceIfNotExists');
        //$dispatcher->connect(AuthenticationProviderManager::class, 'successfullyAuthenticated', WorkspaceService::class, 'switchToReviewWorkspace');
    }
}
