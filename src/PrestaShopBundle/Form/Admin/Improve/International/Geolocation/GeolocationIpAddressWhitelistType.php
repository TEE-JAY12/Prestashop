<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */

namespace PrestaShopBundle\Form\Admin\Improve\International\Geolocation;

use PrestaShopBundle\Form\Admin\Type\TranslatorAwareType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * Class GeolocationIpAddressWhitelistType is responsible for handling "Improve > International > Localization > Geolocation"
 * IP addresses whitelist form.
 */
class GeolocationIpAddressWhitelistType extends TranslatorAwareType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('geolocation_whitelist', TextareaType::class, [
                'required' => false,
                'label' => $this->trans(
                    'Whitelisted IP addresses',
                    'Admin.International.Feature'
                ),
                'attr' => [
                    'col' => 15,
                    'rows' => 30,
                ],
            ]);

        $builder->get('geolocation_whitelist')
            ->addModelTransformer(new CallbackTransformer(
                function ($ipWhitelistTextWithSemiColons) {
                    return str_replace(';', "\n", $ipWhitelistTextWithSemiColons);
                },
                function ($ipWhitelistTextWithNewLines) {
                    return str_replace(["\r\n", "\r", "\n"], ';', $ipWhitelistTextWithNewLines);
                }
            ));
    }
}
