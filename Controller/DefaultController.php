<?php

namespace TSS\BehatBuilderBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

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

    /**
     * @Route("/load-file", name="behat_load_file", options={"expose"=true})
     * @Method("POST")
     */
    public function loadFileAction()
    {
        $fileContent = $this->get('tss_behat.builder')->loadFile($this->getRequest()->request->get('file'));

        return new Response($fileContent);
    }

    /**
     * @Route("/save-file", name="behat_save_file", options={"expose"=true})
     * @Method("POST")
     */
    public function saveFileAction()
    {
        $success = $this->get('tss_behat.builder')->saveFile($this->getRequest()->request->get('file'), $this->getRequest()->request->get('data'));

        return new JsonResponse(array(
           'success' => $success
        ));
    }
}
