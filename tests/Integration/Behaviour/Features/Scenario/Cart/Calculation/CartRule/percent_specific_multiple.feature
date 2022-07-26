@restore-all-tables-before-feature
Feature: Cart rule (percent) calculation with multiple cart rules restricted to one product
  As a customer
  I must be able to have correct cart total when adding cart rules

  Scenario: Empty cart, 2 cartRules
    Given I have an empty default cart
    Given shop configuration for "PS_CART_RULE_FEATURE_ACTIVE" is set to 1
    Given there is a product in the catalog named "product2" with a price of 32.388 and 1000 items in stock
    Given there is a cart rule named "cartrule10" that applies a percent discount of 50.0% with priority 10, quantity of 1000 and quantity per user 1000
    Given cart rule "cartrule10" is restricted to product "product2"
    Given cart rule "cartrule10" has a discount code "foo10"
    Given there is a cart rule named "cartrule11" that applies a percent discount of 10.0% with priority 11, quantity of 1000 and quantity per user 1000
    Given cart rule "cartrule11" is restricted to product "product2"
    Given cart rule "cartrule11" has a discount code "foo11"
    Then I should have 0 different products in my cart
    When I use the discount "cartrule10"
    When I use the discount "cartrule11"
    Then my cart total should be 0.0 tax included
    Then my cart total using previous calculation method should be 0.0 tax included

  Scenario: one product in cart, quantity 1, specific 50% cartRule on product #2, specific 10% cartRule on product #2
    Given I have an empty default cart
    Given shop configuration for "PS_CART_RULE_FEATURE_ACTIVE" is set to 1
    Given there is a product in the catalog named "product1" with a price of 19.812 and 1000 items in stock
    Given there is a product in the catalog named "product2" with a price of 32.388 and 1000 items in stock
    Given there is a cart rule named "cartrule10" that applies a percent discount of 50.0% with priority 10, quantity of 1000 and quantity per user 1000
    Given cart rule "cartrule10" is restricted to product "product2"
    Given cart rule "cartrule10" has a discount code "foo10"
    Given there is a cart rule named "cartrule11" that applies a percent discount of 10.0% with priority 11, quantity of 1000 and quantity per user 1000
    Given cart rule "cartrule11" is restricted to product "product2"
    Given cart rule "cartrule11" has a discount code "foo11"
    When I add 1 items of product "product1" in my cart
    When I use the discount "cartrule10"
    When I use the discount "cartrule11"
    Then my cart total should be 26.812 tax included
    Then my cart total using previous calculation method should be 26.812 tax included

  Scenario: one product in cart, quantity 3, specific 50% cartRule on product #2, specific 10% cartRule on product #2
    Given I have an empty default cart
    Given shop configuration for "PS_CART_RULE_FEATURE_ACTIVE" is set to 1
    Given there is a product in the catalog named "product1" with a price of 19.812 and 1000 items in stock
    Given there is a product in the catalog named "product2" with a price of 32.388 and 1000 items in stock
    Given there is a cart rule named "cartrule10" that applies a percent discount of 50.0% with priority 10, quantity of 1000 and quantity per user 1000
    Given cart rule "cartrule10" is restricted to product "product2"
    Given cart rule "cartrule10" has a discount code "foo10"
    Given there is a cart rule named "cartrule11" that applies a percent discount of 10.0% with priority 11, quantity of 1000 and quantity per user 1000
    Given cart rule "cartrule11" is restricted to product "product2"
    Given cart rule "cartrule11" has a discount code "foo11"
    When I add 3 items of product "product1" in my cart
    When I use the discount "cartrule10"
    When I use the discount "cartrule11"
    Then my cart total should be 66.436 tax included
    Then my cart total using previous calculation method should be 66.436 tax included

  Scenario: one product #2 in cart, quantity 3, specific 50% cartRule on product #2, specific 10% cartRule on product #2
    Given I have an empty default cart
    Given shop configuration for "PS_CART_RULE_FEATURE_ACTIVE" is set to 1
    Given there is a product in the catalog named "product2" with a price of 32.388 and 1000 items in stock
    Given there is a cart rule named "cartrule10" that applies a percent discount of 50.0% with priority 10, quantity of 1000 and quantity per user 1000
    Given cart rule "cartrule10" is restricted to product "product2"
    Given cart rule "cartrule10" has a discount code "foo10"
    Given there is a cart rule named "cartrule11" that applies a percent discount of 10.0% with priority 11, quantity of 1000 and quantity per user 1000
    Given cart rule "cartrule11" is restricted to product "product2"
    Given cart rule "cartrule11" has a discount code "foo11"
    When I add 3 items of product "product2" in my cart
    When I use the discount "cartrule10"
    When I use the discount "cartrule11"
    Then my cart total should be 50.7238 tax included
    #known to fail on previous
    #Then my cart total using previous calculation method should be 50.7238 tax included

  Scenario: 3 products in cart, several quantities, specific 50% cartRule on product #2, specific 10% cartRule on product #2
    Given I have an empty default cart
    Given shop configuration for "PS_CART_RULE_FEATURE_ACTIVE" is set to 1
    Given there is a product in the catalog named "product1" with a price of 19.812 and 1000 items in stock
    Given there is a product in the catalog named "product2" with a price of 32.388 and 1000 items in stock
    Given there is a product in the catalog named "product3" with a price of 31.188 and 1000 items in stock
    Given there is a cart rule named "cartrule10" that applies a percent discount of 50.0% with priority 10, quantity of 1000 and quantity per user 1000
    Given cart rule "cartrule10" is restricted to product "product2"
    Given cart rule "cartrule10" has a discount code "foo10"
    Given there is a cart rule named "cartrule11" that applies a percent discount of 10.0% with priority 11, quantity of 1000 and quantity per user 1000
    Given cart rule "cartrule11" is restricted to product "product2"
    Given cart rule "cartrule11" has a discount code "foo11"
    When I add 3 items of product "product1" in my cart
    When I add 2 items of product "product2" in my cart
    When I add 1 items of product "product3" in my cart
    When I use the discount "cartrule10"
    When I use the discount "cartrule11"
    Then my cart total should be 126.7732 tax included
    #known to fail on previous
    #Then my cart total using previous calculation method should be 126.7732 tax included
