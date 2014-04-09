<?php

namespace TSS\BehatBuilderBundle\Service;

use JMS\Serializer\Handler\ArrayCollectionHandler;
use Symfony\Component\Finder\Finder;

class Builder {

    /**
     * @var Finder
     */
    protected $finder;

    protected $features;

    protected $kernelRootDir;

    public function __construct($kernelRootDir)
    {
        $this->finder = Finder::create();
        $this->features = array();
        $this->kernelRootDir = $kernelRootDir;
    }

    public function getFeatures()
    {
        $this->finder
            ->files()
            ->in($this->kernelRootDir . '/../src')
            ->name('*.feature');

        foreach ($this->finder as $file) {
            $this->features[$file->getRealPath()] = $file->getFilename();
        }

        return $this->features;
    }
}