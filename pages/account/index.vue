<template>
  <div class="template-account">
    <div class="template-account__container container">
      <div class="row">
        <div class="col xs12">
          <div class="template-account__header">
            <h2>{{ $t('account.title') }}</h2>
            <button
              class="text-link"
              @click="handleLogoutClick"
            >
              {{ $t('account.logout') }}
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col xs12 m7">
          <h3>{{ customerHasOrders ? 'Your orders' : $t('account.order.no_orders') }}</h3>
          <table v-if="customerHasOrders">
            <thead>
              <th>{{ $t('account.order.orderNumber') }}</th>
              <th>{{ $t('account.order.date') }}</th>
              <th>{{ $t('account.order.products') }}</th>
              <th>{{ $t('account.order.total') }}</th>
            </thead>
            <tbody>
              <tr
                v-for="(order, index) in orders"
                :key="index"
              >
                <td>{{ order.orderNumber }}</td>
                <td>{{ order.processedAt }}</td>
                <td>
                  <ul>
                    <li
                      v-for="(lineItem, index) in order.lineItems.edges"
                      :key="index"
                    >
                      {{ lineItem.node.title }}
                    </li>
                  </ul>
                </td>
                <td>{{ order.totalPriceV2 }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col xs12 m5">
          <div class="template-account__aside">
            <h3>{{ customerHasAddresses ? 'Your saved addresses' : $t('account.addresses.no_addresses') }}</h3>

            <button
              v-show="!addingAddress"
              class="text-link"
              @click="handleAddAddressClick($event)"
            >
              {{ $t('account.addresses.add') }}
            </button>

            <form v-show="addingAddress">
              <div
                v-for="(field, index) in addressFields"
                :key="index"
              >
                <label :for="field.name">{{ field.label }}</label>

                <select
                  v-if="field.name === 'country'"
                  :name="field.name"
                >
                  <option
                    v-for="(country, countryIndex) in countryOptions"
                    :key="countryIndex"
                    :value="country"
                  >
                    {{ getCountryName(country) }}
                  </option>
                </select>

                <select
                  v-else-if="field.type === 'select'"
                  :name="field.name"
                >
                  <option
                    v-for="(option, optionIndex) in field.options"
                    :key="optionIndex"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>

                <input
                  v-else
                  :type="field.type"
                  :name="field.name"
                >
              </div>

              <button @click="handleCreateAddressClick($event)">Save</button>
            </form>

            <div
              v-for="(address, index) in addresses"
              :ref="`address-${index}`"
              :key="index"
            >
              <address v-show="!addressIsEditing(index)">
                <span v-if="address.firstName || address.lastName">
                  {{ address.firstName }} {{ address.lastName }}<br>
                </span>

                <span
                  v-for="(line, lineIndex) in address.formatted"
                  :key="lineIndex"
                >
                  {{ line }}<br>
                </span>

                <span v-if="address.phone">{{ address.phone }}<br></span>

                <button @click="handleEditAddressClick(index)">{{ $t('account.addresses.edit') }}</button>
                <button @click="handleDeleteAddressClick(index, $event)">{{ $t('account.addresses.delete') }}</button>
              </address>

              <form v-show="addressIsEditing(index)">
                <div
                  v-for="(field, index) in addressFields"
                  :key="index"
                >
                  <label :for="field.name">{{ field.label }}</label>

                  <select
                    v-if="field.name === 'country'"
                    :name="field.name"
                    @change="handleAddressFieldChange($event)"
                  >
                    <option
                      v-for="(country, countryIndex) in countryOptions"
                      :key="countryIndex"
                      :value="country"
                    >
                      {{ getCountryName(country) }}
                    </option>
                  </select>

                  <select
                    v-else-if="field.type === 'select'"
                    :name="field.name"
                    @change="handleAddressFieldChange($event)"
                  >
                    <option
                      v-for="(option, optionIndex) in field.options"
                      :key="optionIndex"
                      :value="option.value"
                      :selected="address[field.name] === option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>

                  <input
                    v-else
                    :type="field.type"
                    :name="field.name"
                    :value="address[field.name]"
                    @change="handleAddressFieldChange($event)"
                    @onkeydown="handleAddressFieldChange($event)"
                  >
                </div>

                <button @click="handleSaveAddressClick(index, $event)">{{ $t('account.addresses.save') }}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/styles/pages/account/index';
</style>

<script>
import { getName } from 'country-list';
import getCustomer from '../../graphql/queries/getCustomer';

export default {
  data() {
    return {
      addingAddress: false,
      addresses: [],
      addressFields: [
        {
          name: 'firstName',
          label: this.$t('account.addresses.firstName'),
          type: 'text',
        },
        {
          name: 'lastName',
          label: this.$t('account.addresses.lastName'),
          type: 'text',
        },
        {
          name: 'company',
          label: this.$t('account.addresses.company'),
          type: 'text',
        },
        {
          name: 'address1',
          label: this.$t('account.addresses.address1'),
          type: 'text',
        },
        {
          name: 'address2',
          label: this.$t('account.addresses.address2'),
          type: 'text',
        },
        {
          name: 'city',
          label: this.$t('account.addresses.city'),
          type: 'text',
        },
        {
          name: 'country',
          label: this.$t('account.addresses.country'),
          type: 'select',
          options: this.countryOptions,
        },
        {
          name: 'zip',
          label: this.$t('account.addresses.zip'),
          type: 'text',
        },
        {
          name: 'phone',
          label: this.$t('account.addresses.phone'),
          type: 'tel',
        },
      ],
      editingAddresses: [],
    }
  },
  async asyncData({ app, store, req, route }) {
    const customerAccessToken = app.$cookies.get('access_token');
    const client = app.apolloProvider.defaultClient;
    
    if (!customerAccessToken) {
      return {
        customer: false,
      }
    }

    const customer = await client.query({
      query: getCustomer,
      variables: {
        customerAccessToken,
      },
    })
      .catch((error) => error);

    return {
      addresses: customer.data.customer.addresses.edges.map((address) => address.node),
      customer: customer.data.customer,
      orders: customer.data.customer.orders.edges.map((order) => order.node),
    }
  },
  mounted() {
    if (!this.customer) {
      this.$router.push($getLocalePath('/account/login'));
    }
  },
  methods: {

    /**
     * Handles the log out click.
     */
    handleLogoutClick() {
      this.$store.dispatch('logoutCustomer');
    },

    /**
     * Handles the add address click.
     * @param {object} event - The event.
     */
    handleAddAddressClick(event) {
      event.preventDefault();
      this.addingAddress = true;
    },

    /**
     * Handles the create address click.
     * @param {object} event - The event.
     */
    handleCreateAddressClick(event) {
      const form = event.target.closest('form');
      const fields = form.querySelectorAll('input, select');
      const address = {};

      event.target.textContent = this.$t('account.addresses.saving');

      [...fields].forEach((field) => {
        address[field.name] = field.value;
      });

      event.preventDefault();
      
      this.$store.dispatch('createCustomerAddress', address)
        .then(({ data }) => {
          this.addresses.push(data.customerAddressCreate.customerAddress);
          this.addingAddress = false;
          event.target.textContent = this.$t('account.addresses.save');
          event.target.closest('form').reset();
        });
    },

    /**
     * Handles the address edit event.
     * @param {integer} index - The index.
     */
    handleEditAddressClick(index) {
      this.editingAddresses.push(index);
    },

    /**
     * Handles the address save event.
     * @param {integer} index - The index.
     * @param {object} event - The event.
     */
    handleSaveAddressClick(index, event) {
      const form = event.target.closest('form');
      const id = this.addresses[index].id;
      const fields = form.querySelectorAll('input, select');
      const address = {};

      event.target.textContent = this.$t('account.addresses.saving');

      [...fields].forEach((field) => {
        address[field.name] = field.value;
      });

      event.preventDefault();

      this.$store.dispatch('updateCustomerAddress', { id, address })
        .then(({ data }) => {
          this.$set(this.addresses, index, data.customerAddressUpdate.customerAddress);
          this.editingAddresses = this.editingAddresses.filter((item) => item !== index);
          event.target.textContent = this.$t('account.addresses.save');
        });
    },

    /**
     * Handles the address delete event.
     * @param {integer} index - The index.
     * @param {object} event - The event.
     */
    handleDeleteAddressClick(index, event) {
      event.target.textContent = this.$t('account.addresses.deleting');

      this.$store.dispatch('deleteCustomerAddress', this.addresses[index].id)
        .then(({ data }) => {
          event.target.textContent = this.$t('account.addresses.delete');

          this.addresses = this.addresses.filter((address) => {
            return address.id !== btoa(data.customerAddressDelete.deletedCustomerAddressId);
          });
        });
    },

    /**
     * Returns if the given address is being edited.
     * @param {integer} index - The index.
     */
    addressIsEditing(index) {
      return this.editingAddresses.includes(index);
    },

    /**
     * Returns the country name for the code.
     * @param {string} code - The country code.
     */
    getCountryName(code) {
      return getName(code);
    },

    /**
     * Handles the address field change event.
     * @param {object} event - The event.
     */
    handleAddressFieldChange(event) {
      const target = event.target;

      this.addressFields.forEach((field) => {
        if (field.name === target.name) {
          field.value = target.value;
        }
      });
    },

    setAddresses() {
      this.addresses = this.customer.addresses.edges.map((item) => item.node);
    },
  },
  computed: {
    customerHasOrders() {
      return this.orders.length > 0;
    },
    customerHasAddresses() {
      return this.addresses.length > 0;
    },
    countryOptions() {
      return this.$store.state.shop.shipsToCountries;
    }
  },
}
</script>