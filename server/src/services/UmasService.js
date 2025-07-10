import { ApiWrapper } from "../utils/ApiWrapper.js"
import { imageMap } from "../utils/imageMapper.js"

const umaApi = new ApiWrapper('https://umapyoi.net/api/v1')


class UmasService {
  async getOneUma(umaId) {
    const umaDetails = await umaApi.get(`character/${umaId}`)
    const umaPictures = await umaApi.get(`character/images/${umaId}`) ?? []
    console.log('pics', umaPictures.length)
    umaDetails.pictures = imageMap(umaPictures)
    return umaDetails
  }

  async getAllUmas() {
    const umas = await umaApi.get('character/info')
    return umas
  }

}

export const umasService = new UmasService()


