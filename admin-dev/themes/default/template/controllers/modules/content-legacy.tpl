{**
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
 *}

{if isset($module_content)}
	{$module_content}
{else}

	{if isset($smarty.get.addnewmodule) && ($context_mode == Context::MODE_HOST)}

		<div class="defaultForm form-horizontal">
				<div class="panel" id="">
					<div class="panel-heading">
						<i class="icon-picture"></i> {l s='Add a new module'}
					</div>

					<div class="form-wrapper">
						<div class="form-group">
							<p>{l s='To add a new module, simply connect to your PrestaShop Addons account and all your purchases will be automatically imported.'}</p>
						</div>
					</div><!-- /.form-wrapper -->

					<div class="panel-footer">
						<a href="{$link->getAdminLink('AdminModules', true)|escape:'html':'UTF-8'}" class="btn btn-default">
							<i class="process-icon-cancel"></i> {l s='Cancel' d='Admin.Actions'}
						</a>
						<a href="#" data-toggle="modal" data-target="#modal_addons_connect" class="btn btn-default pull-right">
							<i class="process-icon-next"></i> {l s='Next' d='Admin.Global'}
						</a>
					</div>
				</div>

				<div class="alert alert-info">
					<h4>{l s='Can I add my own modules?'}</h4>
					<p>{l s='Please note that for security reasons, you can only add modules that are being distributed on PrestaShop Addons, the official marketplace.'}</p>
				</div>

		</div>

	{elseif !isset($smarty.get.configure)}
		{include file='controllers/modules/js.tpl'}
		{include file='controllers/modules/page.tpl'}
	{/if}
{/if}
