import { reactive } from 'vue'
import { Uma } from '@/models/Uma.js'
import speImg from '../../imageData/imagesClean/01_specialweek_clean.webp'
import maruImg from '../../imageData/imagesClean/04_maruzensky_clean.webp'
import taikiImg from '../../imageData/imagesClean/10_taikishuttle_clean.webp'
import inesImg from '../../imageData/imagesClean/32_inesfujin_clean.webp'
import eishinImg from '../../imageData/imagesClean/37_eishinflash_clean.webp'
import { Racer } from './models/Racer.js'

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


export const RaceState = reactive({
  racers: [
    new Racer('Special Week', speImg, { speed: 10, power: 10, stamina: 45 }),
    new Racer('Maruzensky', maruImg, { speed: 8, power: 12, stamina: 45 }),
    new Racer('Ines Fujin', inesImg, { speed: 15, power: 10, stamina: 35 })
  ]
})

