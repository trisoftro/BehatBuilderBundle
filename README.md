TSSBehatBuilderBundle
=====================

Maintaining Behat features of a Symfony2 project directly in the browser

Installation instructions:

- Easiest way to install is via composer, 
  ```composer.phar require tsslabs/behat-builder-bundle``` 
  
   OR
    
   add those lines to ```./composer.json```:


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

- Add routing:
      ```
  tss_behat_builder:
     resource: "@TSSBehatBuilderBundle/Controller/"
     type:     annotation
     prefix:   /
      


- Symlink assets: 

      ```
    php app/console assets:install --symlink web
      ```
      
- Dump assetic: 

      ```
    php app/console assetic:dump web
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
