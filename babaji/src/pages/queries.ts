import { graphql } from "@typings/gql";

export const TEST_QUERY = graphql(`
  query MyQuery {
    businesses {
      ad_spend_distribution
      business_size
      customer_acquisition_cost
      customer_behavior
      description
      customer_lifetime_value
      customer_interests
    }
  }
`);
