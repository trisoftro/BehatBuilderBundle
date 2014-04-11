<?php

namespace TSS\BehatBuilderBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Validator\Constraints\NotBlank;

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
                'required' => true,
                'constraints' => array(
                    new NotBlank(),
                    new \Symfony\Component\Validator\Constraints\Choice(array(
                        'choices' => $this->behatBuilder->getBundles()
                    ))
                )
            ))
            ->add('filename', 'text', array(
                'attr' => array(
                    'data-placeholder' => 'Write a filename for your feature'
                ),
                'constraints' => array(
                    new NotBlank()
                )
            ))
        ;
    }

    public function getName()
    {
        return 'tss_behatbuilderbundle_newfeature';
    }
}
