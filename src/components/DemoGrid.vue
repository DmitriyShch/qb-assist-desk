<template>
  <table :id="tableId">
    <thead>
      <tr>
        <th
          v-for="key in columns"
          @click="sortBy(key)"
          v-bind:key="key"
          :class="{ active: sortKey == key }"
        >
          {{ key | capitalize }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"></span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredHeroes" v-bind:key="entry.name">
        <td v-for="key in columns" v-bind:key="key">
          {{ entry[key] }}
          <input
            type="checkbox"
            v-show="key == markColumn"
            name="markColumn"
            id="markColumn"
            @change="markColumnChange($event, entry[keyColumn])"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  template: '#grid-template',
  name: 'demo-grid',
  props: {
    tableId: String,
    keyColumn: String,
    heroes: Array,
    columns: Array,
    filterKey: String,
    markColumn: String
  },
  data: function() {
    var sortOrders = {}
    this.columns.forEach(function(key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      selectedRows: []
    }
  },
  computed: {
    filteredHeroes: function() {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var heroes = this.heroes
      if (filterKey) {
        heroes = heroes.filter(function(row) {
          return Object.keys(row).some(function(key) {
            return (
              String(row[key])
                .toLowerCase()
                .indexOf(filterKey) > -1
            )
          })
        })
      }
      if (sortKey) {
        heroes = heroes.slice().sort(function(a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return heroes
    }
  },
  filters: {
    capitalize: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function(key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    markColumnChange(e, t1) {
      console.log('markColumnChange')
      console.log(e)
      console.log(t1)
      if (e.target.checked && !this.selectedRows[t1]) {
        this.selectedRows.push(t1)
      }
      if (!e.target.checked && !this.selectedRows[t1]) {
        this.selectedRows = this.selectedRows.filter(x => x != t1)
      }
      console.log(this.selectedRows)
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 14px;
  color: #444;
}

table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #42b983;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

tbody tr:hover {
  background-color: #9c6416 !important; /* Цвет фона под ссылкой */
  color: rgb(255, 227, 253); /* Цвет ссылки */
}

tbody tr {
  background-color: #cca1c8;
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}
</style>
