<?php

namespace Neos\DocsNeosIo\ContentRepository\Transformations;

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\NodeMigration\Transformation\GlobalTransformationInterface;
use Neos\ContentRepository\NodeMigration\Transformation\InvalidMigrationConfiguration;
use Neos\ContentRepository\NodeMigration\Transformation\NodeAggregateBasedTransformationInterface;
use Neos\ContentRepository\NodeMigration\Transformation\NodeBasedTransformationInterface;
use Neos\ContentRepository\NodeMigration\Transformation\TransformationFactoryInterface;

/**
 * Transformation to migrate existing title properties to use the soft hyphen instead of ||
 */
class UpdateHyphenTransformation implements TransformationFactoryInterface
{
//    /**
//     * @var string
//     */
//    protected $propertyName;
//    private $setProperty;
//
//    /**
//     * Sets the new name for the node to change.
//     *
//     * @param string $propertyName
//     * @return void
//     */
//    public function setPropertyName($propertyName)
//    {
//        $this->propertyName = $propertyName;
//    }
//
//    /**
//     * @return boolean
//     */
//    public function isTransformable($node)
//    {
//        $text = $node->getProperty($this->propertyName);
//        return str_contains($text, '||');
//    }
//
//    /**
//     * Replace double pipe with soft hyphen
//     *
//     * @return void
//     */
//    public function execute($node)
//    {
//        $text = $node->getProperty($this->propertyName);
//        $softHyphen = json_decode('"\u00AD"', true);
//        $this->setProperty = $node->setProperty($this->propertyName, str_replace('||', $softHyphen, $text));
//    }
    public function build(array $settings, ContentRepository $contentRepository): GlobalTransformationInterface|NodeAggregateBasedTransformationInterface|NodeBasedTransformationInterface
    {
        // TODO: fix
        throw new InvalidMigrationConfiguration('TODO: fix me');
    }
}
