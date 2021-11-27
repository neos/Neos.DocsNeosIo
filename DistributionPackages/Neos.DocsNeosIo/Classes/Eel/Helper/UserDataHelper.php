<?php

namespace Neos\DocsNeosIo\Eel\Helper;

use Neos\Eel\Helper\ArrayHelper;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Repository\UserRepository;

class UserDataHelper extends ArrayHelper
{
    /**
     * @var string[]
     * @Flow\InjectConfiguration(package="Neos.Party", path="availableUsageTypes")
     * @Flow\Transient
     */
    protected $availableUsageTypes = [];

    /**
     * @Flow\Inject
     * @var UserRepository
     */
    protected $userRepository;

    /**
     * @param array $userIdentifiers
     * @return array<User>
     */
    public function getData($userIdentifiers)
    {
        $users = [];
        foreach ($userIdentifiers as $userIdentifier) {
            $user = $this->userRepository->findByIdentifier($userIdentifier);
            if ($user) {
                $email = false;
                foreach ($user->getElectronicAddresses() as $current) {
                    if (!$email && isset($this->availableUsageTypes['Email']) && $current->getType() == $this->availableUsageTypes['Email']) {
                        $email = $current->getIdentifier();
                    }
                }

                $users[] = [
                    'label' => $user->getLabel(),
                    'gravatar' => $email ? $this->gravatarUri($email, 'mm', 400) : false
                ];
            }
        }
        return $users;
    }

    /**
     * Get a gravatar uri from an email address
     *
     * @param string $email
     * @param string $default
     * @param integer $size
     * @return string
     */
    public function gravatarUri($email, $default = 'mm', $size = 80)
    {
        return 'https://www.gravatar.com/avatar/' . md5(strtolower(trim($email))) . '?d=' . $default . '&s=' . $size;
    }

}
