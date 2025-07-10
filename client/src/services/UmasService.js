import { logger } from "@/utils/Logger.js"
import { api } from "./AxiosService.js"
import { Uma } from "@/models/Uma.js"
import { AppState } from "@/AppState.js"



class UmasService {
  async getOneUma(umaId) {
    AppState.activeUma = null
    const res = await api.get(`api/umas/${umaId}`)
    logger.log('👉🏇📡', res.data)
    const uma = new Uma(res.data)
    AppState.activeUma = uma
  }
  async getUmas() {
    const res = await api.get('api/umas')
    logger.log('🏇📡', res.data)
    const umas = res.data.map(u => new Uma(u))
    AppState.umas = umas
  }

  favoriteUma(umaId) {
    let favorites = this.loadFavoriteUmas()
    if (favorites.includes(umaId)) {
      const umaIndex = favorites.indexOf(umaId)
      favorites.splice(umaIndex, 1)
      logger.log('removed', umaId)
    } else {
      favorites.unshift(umaId)
      logger.log('added', umaId)
    }
    localStorage.setItem('fav-umas', JSON.stringify(favorites))
    AppState.favorites = favorites
  }

  loadFavoriteUmas() {
    let data = localStorage.getItem('fav-umas') || '[]'
    let favorites = JSON.parse(data)
    AppState.favorites = favorites
    return favorites
  }

}

export const umasService = new UmasService()