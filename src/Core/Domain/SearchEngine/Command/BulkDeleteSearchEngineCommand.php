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

namespace PrestaShop\PrestaShop\Core\Domain\SearchEngine\Command;

use PrestaShop\PrestaShop\Core\Domain\SearchEngine\Exception\SearchEngineException;
use PrestaShop\PrestaShop\Core\Domain\SearchEngine\ValueObject\SearchEngineId;

/**
 * Deletes search engines in bulk action.
 */
class BulkDeleteSearchEngineCommand
{
    /**
     * @var SearchEngineId[]
     */
    private $searchEngineIds = [];

    /**
     * @param int[] $searchEngineIds
     *
     * @throws SearchEngineException
     */
    public function __construct(array $searchEngineIds)
    {
        $this->setSearchEngineIds($searchEngineIds);
    }

    /**
     * @return SearchEngineId[]
     */
    public function getSearchEngineIds(): array
    {
        return $this->searchEngineIds;
    }

    /**
     * @param int[] $searchEngineIds
     *
     * @throws SearchEngineException
     */
    private function setSearchEngineIds(array $searchEngineIds): void
    {
        foreach ($searchEngineIds as $searchEngineId) {
            $this->searchEngineIds[] = new SearchEngineId((int) $searchEngineId);
        }
    }
}
