<?php

namespace Neos\DocsNeosIo\ContentRepository\Transformations;

use Neos\ContentRepository\Domain\Model\NodeData;
use Neos\ContentRepository\Migration\Transformations\AbstractTransformation;

/**
 * Transformation to migrate existing title properties to use the soft hyphen instead of ||
 */
class UpdateHyphenTransformation extends AbstractTransformation
{
    /**
     * @var string
     */
    protected $propertyName;
    private $setProperty;

    /**
     * Sets the new name for the node to change.
     *
     * @param string $propertyName
     * @return void
     */
    public function setPropertyName($propertyName)
    {
        $this->propertyName = $propertyName;
    }

    /**
     * @param NodeData $node
     * @return boolean
     */
    public function isTransformable(NodeData $node)
    {
        $text = $node->getProperty($this->propertyName);
        return str_contains($text, '||');
    }

    /**
     * Replace double pipe with soft hyphen
     *
     * @param NodeData $node
     * @return void
     */
    public function execute(NodeData $node)
    {
        $text = $node->getProperty($this->propertyName);
        $softHyphen = json_decode('"\u00AD"', true);
        $this->setProperty = $node->setProperty($this->propertyName, str_replace('||', $softHyphen, $text));
    }
}
