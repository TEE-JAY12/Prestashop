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

namespace PrestaShop\PrestaShop\Core\Domain\Order\Exception;

/**
 * Exception thrown when constraint is violated in Order subdomain.
 */
class OrderConstraintException extends OrderException
{
    /**
     * Used in create order from BO when the customer message is invalid.
     */
    public const INVALID_CUSTOMER_MESSAGE = 1;

    /**
     * @var int Is used when invalid (not string) internal note provided
     */
    public const INVALID_INTERNAL_NOTE = 2;

    /**
     * Used in add payment from BO when the payment method is invalid.
     */
    public const INVALID_PAYMENT_METHOD = 3;
}
