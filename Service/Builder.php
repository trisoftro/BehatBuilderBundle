<?php

namespace TSS\BehatBuilderBundle\Service;

use Symfony\Component\Finder\Finder;

class Builder {

    /**
     * @var Finder
     */
    protected $finder;

    protected $features = null;

    protected $bundles = null;

    protected $kernelRootDir;

    public function __construct($kernelRootDir)
    {
        $this->finder = Finder::create();
        $this->kernelRootDir = $kernelRootDir;
    }

    public function getFeatures()
    {
        if (!$this->features) {
            $this->finder
                ->files()
                ->in($this->kernelRootDir . '/../src')
                ->name('*.feature');

            foreach ($this->finder as $file) {
                $groupParsed = explode('/', $file->getRelativePathname());
                $group = $groupParsed[0].'/'.$groupParsed[1];
                if(!isset($this->features[$group])) {
                    $this->features[$group] = array();
                }
                $this->features[$group][$file->getRelativePathname()] = $file->getFilename();
            }
        }

        return $this->features;
    }

    public function getBundles()
    {
        if (!$this->bundles) {
            $this->finder
                ->directories()
                ->in($this->kernelRootDir . '/../src')
                ->name('*Bundle');

            foreach ($this->finder as $directory) {
                $this->bundles[$directory->getRelativePathname()] = $directory->getFilename();
            }
        }

        return $this->bundles;
    }

    public function loadFile($filePath)
    {
        $filePath = $this->kernelRootDir . '/../src/' . $filePath;

        return @file_get_contents($filePath);
    }

    public function saveFile($filePath, $data)
    {
        $filePath = $this->kernelRootDir . '/../src/' . $filePath;

        return @file_put_contents($filePath, $data);
    }
}