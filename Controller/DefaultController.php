<?php

namespace TSS\BehatBuilderBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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
        return array(
            'groups' => $this->get('tss_behat.builder')->getFeatures()
        );
    }

    /**
     * @Route("/load-feature", name="behat_load_feature", options={"expose"=true})
     * @Method("POST")
     */
    public function loadFileAction()
    {
        return new JsonResponse(array(
            'content' => $this->get('tss_behat.builder')->loadFeature($this->getRequest()->request->get('file'))
        ));
    }

    /**
     * @Route("/save-feature", name="behat_save_feature", options={"expose"=true})
     * @Method("POST")
     */
    public function saveFeatureAction()
    {
        return new JsonResponse(array(
           'success' => $this->get('tss_behat.builder')->saveFeature($this->getRequest()->request->get('file'), $this->getRequest()->request->get('data'))
        ));
    }

    /**
     * New feature processing
     *
     * @Route("/new-feature", name="behat_new_feature", options={"expose"=true})
     */
    public function newFeatureAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $form   = $this->createForm(new NewFeatureType($this->get('tss_behat.builder')));

        if ($request->isMethod('POST')) {
            $form->handleRequest($request);

            $data = $form->getData();

            if($this->get('tss_behat.builder')->findByBundleAndFilename($data['bundle'], $data['filename'])) {
                $form->get('filename')->addError(new FormError(sprintf('`%s` feature already found in `%s`.', $data['filename'], $data['bundle'])));
            }

            if ($form->isValid()) {
                $file = $this->get('tss_behat.builder')->createByBundleAndFilename($data['bundle'], $data['filename']);

                return new JsonResponse(array(
                    'success' => true,
                    'file' => $file
                ));
            }
        }

        $content = $this->container->get('templating')->render('TSSBehatBuilderBundle:Default:newFeature.html.twig', array(
            'form' => $form->createView()
        ));

        return new JsonResponse(array(
            'success' => $form->isValid(),
            'content' => $content,
        ));
    }

    /**
     * @Route("/load-features", name="behat_load_features", options={"expose"=true})
     * @Method("POST")
     */
    public function loadFeaturesAction()
    {
        return new JsonResponse(array(
            'content' => $this->get('tss_behat.builder')->loadFeatures()
        ));
    }
}
