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

import createOrderMap from './create-order-map';

const {$} = window;

/**
 * Renders cart rules (cartRules) block
 */
export default class CartRulesRenderer {
  $cartRulesBlock: JQuery;

  $cartRulesTable: JQuery;

  $searchResultBox: JQuery;

  constructor() {
    this.$cartRulesBlock = $(createOrderMap.cartRulesBlock);
    this.$cartRulesTable = $(createOrderMap.cartRulesTable);
    this.$searchResultBox = $(createOrderMap.cartRulesSearchResultBox);
  }

  /**
   * Responsible for rendering cartRules (a.k.a cart rules/discounts) block
   *
   * @param {Array} cartRules
   * @param {Boolean} emptyCart
   */
  renderCartRulesBlock(
    cartRules: Record<string, any>,
    emptyCart: boolean,
  ): void {
    this.hideErrorBlock();
    // do not render cart rules block at all if cart has no products
    if (emptyCart) {
      this.hideCartRulesBlock();
      return;
    }
    this.showCartRulesBlock();

    // do not render cart rules list when there are no cart rules
    if (cartRules.length === 0) {
      this.hideCartRulesList();

      return;
    }

    this.renderList(cartRules);
  }

  /**
   * Responsible for rendering search results dropdown
   *
   * @param searchResults
   */
  renderSearchResults(searchResults: Record<string, any>): void {
    this.clearSearchResults();

    if (searchResults.cart_rules.length === 0) {
      this.renderNotFound();
    } else {
      this.renderFoundCartRules(searchResults.cart_rules);
    }

    this.showResultsDropdown();
  }

  /**
   * Displays error message bellow search input
   *
   * @param message
   */
  displayErrorMessage(message: string): void {
    $(createOrderMap.cartRuleErrorText).text(message);
    this.showErrorBlock();
  }

  /**
   * Hides cart rules search result dropdown
   */
  hideResultsDropdown(): void {
    this.$searchResultBox.addClass('d-none');
  }

  /**
   * Displays cart rules search result dropdown
   *
   * @private
   */
  private showResultsDropdown(): void {
    this.$searchResultBox.removeClass('d-none');
  }

  /**
   * Renders warning that no cart rule was found
   *
   * @private
   */
  private renderNotFound(): void {
    this.$searchResultBox.append(
      $(createOrderMap.cartRulesNotFoundTemplate).html(),
    );
  }

  /**
   * Empties cart rule search results block
   *
   * @private
   */
  private clearSearchResults(): void {
    this.$searchResultBox.empty();
  }

  /**
   * Renders found cart rules after search
   *
   * @param cartRules
   *
   * @private
   */
  private renderFoundCartRules(cartRules: Record<string, any>): void {
    const $cartRuleTemplate = $($(createOrderMap.foundCartRuleTemplate).html());
    Object.values(cartRules).forEach((cartRule) => {
      const $template = $cartRuleTemplate.clone();

      let cartRuleName = cartRule.name;

      if (cartRule.code !== '') {
        cartRuleName = `${cartRule.name} - ${cartRule.code}`;
      }

      $template.text(cartRuleName);
      $template.data('cart-rule-id', cartRule.cartRuleId);
      this.$searchResultBox.append($template);
    });
  }

  /**
   * Responsible for rendering the list of cart rules
   *
   * @param {Array} cartRules
   *
   * @private
   */
  private renderList(cartRules: Record<string, any>): void {
    this.cleanCartRulesList();
    const $cartRulesTableRowTemplate = $(
      $(createOrderMap.cartRulesTableRowTemplate).html(),
    );

    Object.values(cartRules).forEach((cartRule) => {
      const $template = $cartRulesTableRowTemplate.clone();

      $template.find(createOrderMap.cartRuleNameField).text(cartRule.name);
      $template
        .find(createOrderMap.cartRuleDescriptionField)
        .text(cartRule.description);
      $template.find(createOrderMap.cartRuleValueField).text(cartRule.value);
      $template
        .find(createOrderMap.cartRuleDeleteBtn)
        .data('cart-rule-id', cartRule.cartRuleId);

      this.$cartRulesTable.find('tbody').append($template);
    });

    this.showCartRulesList();
  }

  /**
   * Shows error block
   *
   * @private
   */
  private showErrorBlock(): void {
    $(createOrderMap.cartRuleErrorBlock).removeClass('d-none');
  }

  /**
   * Hides error block
   *
   * @private
   */
  private hideErrorBlock(): void {
    $(createOrderMap.cartRuleErrorBlock).addClass('d-none');
  }

  /**
   * Shows cartRules block
   *
   * @private
   */
  private showCartRulesBlock(): void {
    this.$cartRulesBlock.removeClass('d-none');
  }

  /**
   * hide cartRules block
   *
   * @private
   */
  private hideCartRulesBlock(): void {
    this.$cartRulesBlock.addClass('d-none');
  }

  /**
   * Display the list block of cart rules
   *
   * @private
   */
  private showCartRulesList(): void {
    this.$cartRulesTable.removeClass('d-none');
  }

  /**
   * Hide list block of cart rules
   *
   * @private
   */
  private hideCartRulesList(): void {
    this.$cartRulesTable.addClass('d-none');
  }

  /**
   * remove items in cart rules list
   *
   * @private
   */
  private cleanCartRulesList(): void {
    this.$cartRulesTable.find('tbody').empty();
  }
}
