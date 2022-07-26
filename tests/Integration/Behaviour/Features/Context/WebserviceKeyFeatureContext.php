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

declare(strict_types=1);

namespace Tests\Integration\Behaviour\Features\Context;

use RuntimeException;
use Tests\Integration\Behaviour\Features\Context\Util\PrimitiveUtils;
use WebserviceKey;

class WebserviceKeyFeatureContext extends AbstractPrestaShopFeatureContext
{
    /**
     * @Then webservice key :reference key should be :key
     */
    public function assertWebserviceKeyMatches(string $reference, string $key): void
    {
        $webserviceKey = $this->getWebserviceKeyFromKey($reference);

        if ($webserviceKey->key !== $key) {
            throw new RuntimeException(sprintf('Webservice key "%s" does not match "%s" key.', $webserviceKey->key, $key));
        }
    }

    /**
     * @Then webservice key :reference description should be :description
     */
    public function assertWebserviceDescriptionMatches(string $reference, string $description): void
    {
        $webserviceKey = $this->getWebserviceKeyFromKey($reference);

        if ($webserviceKey->description !== $description) {
            throw new RuntimeException(sprintf('Webservice key "%s" description is not "%s".', $webserviceKey->id, $description));
        }
    }

    /**
     * @Then /^webservice key "(.+)" should be (enabled|disabled)$/
     */
    public function assertWebserviceKeyStatus(string $reference, string $status): void
    {
        $webserviceKey = $this->getWebserviceKeyFromKey($reference);

        $isEnabled = 'enabled' === $status;

        if ((bool) $webserviceKey->active !== $isEnabled) {
            throw new RuntimeException(sprintf('Webservice key "%s" is not "%s"', $webserviceKey->id, $status));
        }
    }

    /**
     * @Then /^webservice key "(.+)" should have "(GET|POST|PUT|DELETE|HEAD)" permission for "([^"]*)" resources$/
     */
    public function assertWebserviceKeyPermission(string $reference, string $permission, string $resources): void
    {
        $webserviceKey = $this->getWebserviceKeyFromKey($reference);

        $resources = PrimitiveUtils::castStringArrayIntoArray($resources);

        $permissions = WebserviceKey::getPermissionForAccount($webserviceKey->key);

        foreach ($resources as $resource) {
            if (!isset($permissions[$resource])) {
                throw new RuntimeException(sprintf('Resource "%s" is not configured for "%s" key', $resource, $webserviceKey->key));
            }

            if (!in_array($permission, $permissions[$resource], true)) {
                throw new RuntimeException(sprintf('"%s" permission is not configured for resource "%s" for "%s" key', $permission, $resource, $webserviceKey->key));
            }
        }
    }

    /**
     * @param string $key
     *
     * @return WebserviceKey
     */
    private function getWebserviceKeyFromKey(string $key): WebserviceKey
    {
        $webserviceKeyId = WebserviceKey::getIdFromKey($key);

        return new WebserviceKey($webserviceKeyId);
    }
}
