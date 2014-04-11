TSSBehatBuilderBundle
=====================

Maintaining Behat features of a Symfony2 project directly in the browser

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

- Symlink assets: 

```
    php app/console assets:install --symlink web
```

- Enable the bundle in assetic:
```
    assetic:
        (...)
        bundles:        [ TSSBehatBuilderBundle ]
```

@TODO:
 - add lexical parser and autocompleter

Enjoy :)
