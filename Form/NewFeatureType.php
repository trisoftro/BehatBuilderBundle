<?php

namespace TSS\BehatBuilderBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Doctrine\ORM\EntityRepository;

class NewFeatureType extends AbstractType
{
    protected $behatBuilder;

    public function __construct($behatBuilder)
    {
        $this->behatBuilder = $behatBuilder;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('bundle', 'choice', array(
                'choices' => $this->behatBuilder->getBundles(),
                'attr' => array(
                    'class' => 'select2',
                    'data-placeholder' => 'Select Bundle'
                ),
                'empty_value' => 'Select Bundle',
                'required' => true
            ))
            ->add('filename', 'text', array(
                'attr' => array(
                    'data-placeholder' => 'Write a filename for your feature'
                )
            ))
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {

    }

    public function getName()
    {
        return 'tss_behatbuilderbundle_newfeature';
    }
}
