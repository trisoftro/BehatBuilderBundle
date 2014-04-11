<?php

namespace TSS\BehatBuilderBundle\Service;

use Symfony\Bundle\TwigBundle\Debug\TimedTwigEngine;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

class Builder {
    /**
     * @var \Symfony\Component\Filesystem\Filesystem
     */
    protected $fs;

    protected $features = null;

    protected $bundles = null;

    protected $kernelRootDir;

    /**
     * @var \Symfony\Bundle\TwigBundle\Debug\TimedTwigEngine
     */
    protected $templating;

    public function __construct(TimedTwigEngine $templating, $kernelRootDir)
    {
        $this->templating = $templating;
        $this->kernelRootDir = $kernelRootDir;
        $this->fs = new Filesystem();
    }

    public function getFeatures()
    {
        if (!$this->features) {
            $finder = Finder::create()
                ->files()
                ->in($this->kernelRootDir . '/../src')
                ->name('*.feature');

            foreach ($finder as $file) {
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
            $finder = Finder::create()
                ->directories()
                ->in($this->kernelRootDir . '/../src')
                ->depth(1)
                ->name('*Bundle');

            foreach ($finder as $directory) {
                $this->bundles[$directory->getRelativePathname()] = $directory->getRelativePathname();
            }
        }

        return $this->bundles;
    }

    public function loadFeatures()
    {
        return $this->templating->render('TSSBehatBuilderBundle:Default:features.html.twig', array(
            'groups' => $this->getFeatures()
        ));
    }

    public function loadFeature($filePath)
    {
        $filePath = $this->kernelRootDir . '/../src/' . $filePath;

        return @file_get_contents($filePath);
    }

    public function saveFeature($filePath, $data)
    {
        $filePath = $this->kernelRootDir . '/../src/' . $filePath;

        return @file_put_contents($filePath, $data);
    }

    protected function processFilename($filename)
    {
        $filename = explode('.', $filename);
        if ($filename[count($filename)-1] != 'feature') {
            $filename[] = 'feature';
        }

        return implode('.', $filename);
    }

    public function findByBundleAndFilename($bundle, $filename)
    {
        $filePath = $this->kernelRootDir . '/../src/'. $bundle . '/Features/' . $this->processFilename($filename);

        return $this->fs->exists($filePath);
    }

    public function createByBundleAndFilename($bundle, $filename)
    {
        $filePath = $this->kernelRootDir . '/../src/'. $bundle . '/Features/' . $this->processFilename($filename);
        $filename = basename($filePath);
        $dirPath = str_replace($filename, '', $filePath);

        $this->fs->mkdir($dirPath);
        $this->fs->copy(__DIR__.'/../Features/skeleton.feature', $filePath);
    }
}