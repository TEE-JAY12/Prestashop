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

{if isset($tab_modules_list) && !empty($tab_modules_list)}
	<div class="row row-margin-bottom">
		<div class="col-lg-12">
			<ul class="nav nav-pills">
				{if count($tab_modules_list.not_installed)}
					<li class="active">
						<a href="#tab_modules_list_not_installed" data-toggle="tab">
							{l s='Not Installed'}
						</a>
					</li>
				{/if}
				{if count($tab_modules_list.installed)}
					<li {if count($tab_modules_list.not_installed) == 0}class="active"{/if}>
						<a href="#tab_modules_list_installed" data-toggle="tab">
							{l s='Installed'}
						</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
	<div id="modules_list_container_content" class="tab-content modal-content-overflow">
		{if count($tab_modules_list.not_installed)}
		<div class="tab-pane active" id="tab_modules_list_not_installed">
			<table id="tab_modules_list_not_installed" class="table">
				{foreach from=$tab_modules_list.not_installed item=module}
					{include file='controllers/modules/tab_module_line.tpl' class_row={cycle values=",rowalt"}}
				{/foreach}
			</table>
		</div>
		{/if}
		{if count($tab_modules_list.installed)}
		<div class="tab-pane {if count($tab_modules_list.not_installed) == 0}active{/if}" id="tab_modules_list_installed">
			<table id="tab_modules_list_installed" class="table">
				{foreach from=$tab_modules_list.installed item=module}
					{include file='controllers/modules/tab_module_line.tpl' class_row={cycle values=",rowalt"}}
				{/foreach}
			</table>
		</div>
		{/if}
	</div>
{/if}
<div class="alert alert-addons row-margin-top">
	<a href="https://addons.prestashop.com/?utm_source=back-office&amp;utm_medium=dispatch&amp;utm_campaign=back-office-{$lang_iso|upper}&amp;utm_content=download{if $admin_list_from_source}&amp;utm_term={$admin_list_from_source}{/if}" onclick="return !window.open(this.href);">{l s='More modules on addons.prestashop.com'}</a>
</div>
