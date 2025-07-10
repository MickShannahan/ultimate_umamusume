import { reactive } from 'vue'
import { Uma } from '@/models/Uma.js'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  /**@type {import('@bcwdev/auth0provider-client').Identity} */
  identity: null,
  /** @type {import('./models/Account.js').Account} user info from the database*/
  account: null,

  /** @type {Uma[]} */
  umas: [],

  /** @type {Uma} */
  activeUma: null,

  /** @type {number[]} */
  favorites: []
})

