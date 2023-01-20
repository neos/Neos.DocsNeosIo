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
     * @param NodeData $node
     * @return boolean
     */
    public function isTransformable(NodeData $node)
    {
        $text = $node->getProperty('title');
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
        $text = $node->getProperty('title');
        $softHyphen = json_decode('"\u00AD"', true);
        $node->setProperty('title', str_replace('||', $softHyphen, $text));
    }
}
