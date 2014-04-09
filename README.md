TSSBehatBuilderBundle
=====================

Behat builder interface for building and maintaining scenarios in a Symfony2 project

Installation instructions:

- Easiest way to install is via composer, add those lines to ```./composer.json```:


      ```
      "require": {
        ...
        "tsslabs/behat-builder-bundle": "dev-master"
      }
```


  and then run ```composer.phar install```

- Then enable the bundle in ```./app/AppKernel.php```:

    ```
    public function registerBundles()
    {
        $bundles = array(
                ...
                new TSS\BehatBuilderBundle\TSSBehatBuilderBundle(),
            );
    }
```


Enjoy :)
