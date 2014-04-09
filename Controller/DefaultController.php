<?php

namespace TSS\BehatBuilderBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Behat controller.
 *
 * @Route("/behat")
 */
class DefaultController extends Controller
{
    /**
     * @Route("", name="behat_index")
     * @Template()
     */
    public function indexAction()
    {
        $features = $this->get('tss_behat.builder')->getFeatures();

        return array(
            'features' => $features
        );
    }
}
