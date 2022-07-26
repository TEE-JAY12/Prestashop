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

namespace PrestaShop\PrestaShop\Adapter\Module;

use PrestaShop\PrestaShop\Adapter\Entity\Tab;
use PrestaShop\PrestaShop\Core\Module\DataProvider\TabModuleListProviderInterface;

@trigger_error(
    sprintf(
        '%s is deprecated since version 1.7.8.0 and will be removed in the next major version.',
        TabModuleListProvider::class
    ),
    E_USER_DEPRECATED
);

/**
 * Class TabModuleListProvider is responsible for providing tab modules.
 *
 * @deprecated since 1.7.8.0
 */
final class TabModuleListProvider implements TabModuleListProviderInterface
{
    /**
     * {@inheritdoc}
     */
    public function getTabModules($tabClassName)
    {
        $tabId = Tab::getIdFromClassName($tabClassName);
        $modules = Tab::getTabModulesList($tabId);

        return $modules['default_list'];
    }
}
