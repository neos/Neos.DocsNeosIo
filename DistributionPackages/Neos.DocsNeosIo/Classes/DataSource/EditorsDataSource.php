<?php
namespace Neos\DocsNeosIo\DataSource;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Domain\Service\UserService;
use Neos\Neos\Service\DataSource\AbstractDataSource;

class EditorsDataSource extends AbstractDataSource
{

    /**
     * @var string
     */
    static protected $identifier = 'neos-docsneosio-editors';

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @param array $arguments Additional arguments (key / value)
     * @return array
     */
    public function getData($node = null, array $arguments = [])
    {
        $options = [];
        foreach ($this->userService->getUsers() as $user) {
            $options[$this->persistenceManager->getIdentifierByObject($user)] = ['label' => $user->getLabel()];
        }
        return $options;
    }
}
