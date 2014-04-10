<?php

namespace TSS\BehatBuilderBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use TSS\BehatBuilderBundle\Form\NewFeatureType;

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

        return new JsonResponse(array(
            'content' => $fileContent
        ));
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

    /**
     * New feature processing
     *
     * @Route("/new-feature", name="behat_new_feature", options={"expose"=true})
     * @Template()
     */
    public function newFeatureAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $form   = $this->createForm(new NewFeatureType($this->get('tss_behat.builder')));

        if ($request->isMethod('POST')) {
            $form->bind($request);

            if ($form->isValid()) {


            }
        }

        $formView = $form->createView();

        return array(
            'form' => $formView
        );
    }
}
