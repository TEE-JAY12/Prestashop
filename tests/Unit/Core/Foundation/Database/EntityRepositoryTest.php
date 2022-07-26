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

namespace Tests\Unit\Core\Foundation\Database;

use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Core\Foundation\Database\DatabaseInterface;
use PrestaShop\PrestaShop\Core\Foundation\Database\EntityManager;
use PrestaShop\PrestaShop\Core\Foundation\Database\EntityMetaData;
use PrestaShop\PrestaShop\Core\Foundation\Database\EntityRepository;
use PrestaShop\PrestaShop\Core\Foundation\Database\Exception as DatabaseException;

class EntityRepositoryTest extends TestCase
{
    /**
     * @var EntityRepository
     */
    private $repository;

    protected function setUp(): void
    {
        $mockDb = $this->createMock(DatabaseInterface::class);
        $mockDb->method('select')->withAnyParameters()->willReturn([]);

        $mockEntityManager = $this->createMock(EntityManager::class);
        $mockEntityManager->method('getDatabase')->willReturn($mockDb);

        $this->repository = new EntityRepository(
            $mockEntityManager,
            'ps_',
            new EntityMetaData()
        );
    }

    public function testCallToInvalidMethodThrowsException(): void
    {
        $this->expectException(DatabaseException::class);

        /* @phpstan-ignore-next-line */
        $this->repository->thisDoesNotExist();
    }

    public function testCallToFindByDoesNotThrow(): void
    {
        /* @phpstan-ignore-next-line */
        $this->assertIsArray($this->repository->findByStuff('hey'));
    }

    public function testCallToFindOneByDoesNotThrow(): void
    {
        /* @phpstan-ignore-next-line */
        $this->assertNull($this->repository->findOneByStuff('hey'));
    }
}
