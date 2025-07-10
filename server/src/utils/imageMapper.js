

let images = [{
  "images": [
    {
      "image": "https://images.microcms-assets.io/assets/973fc097984b400db8729642ddff5938/a1c1c3b232d74b0abe59d2cd18bc9fac/admirevega_01.png",
      "uploaded": "2024-02-24"
    },
    {
      "image": "https://web.archive.org/web/20210610083111if_/https://umamusume.jp/app/wp-content/uploads/2021/01/016bc9331c19855676cd460656ff874a.png",
      "uploaded": "2021-01-01"
    },
    {
      "image": "https://web.archive.org/web/20180412063748if_/https://umamusume.jp/assets/images/char_detail_image_a_52.png?rel20180409",
      "uploaded": "2018-04-12"
    }
  ],
  "label": "制服",
  "label_en": "Uniform"
},
{
  "images": [
    {
      "image": "https://images.microcms-assets.io/assets/973fc097984b400db8729642ddff5938/62fc0491475b43589eaebc8cd99f6c74/admirevega_02.png",
      "uploaded": "2024-02-24"
    },
    {
      "image": "https://web.archive.org/web/20230908075214if_/https://umamusume.jp/app/wp-content/uploads/2023/01/a9216c5b3eee1eed016525f04f297931.png",
      "uploaded": "2022-02-01"
    }
  ],
  "label": "勝負服",
  "label_en": "Racing Outfit"
},
{
  "images": [
    {
      "image": "https://images.microcms-assets.io/assets/973fc097984b400db8729642ddff5938/b8398c7961134b0dbb1da0fe781e645d/admirevega_03.png",
      "uploaded": "2024-02-24"
    },
    {
      "image": "https://web.archive.org/web/20210610083113if_/https://umamusume.jp/app/wp-content/uploads/2021/01/ab108f5de6604a4ee728aae69fa9f16c.png",
      "uploaded": "2021-01-01"
    },
    {
      "image": "https://web.archive.org/web/20180412063749if_/https://umamusume.jp/assets/images/char_detail_image_b_52.png?rel20180409",
      "uploaded": "2018-04-12"
    },
    {
      "image": "https://web.archive.org/web/20180307214410if_/https://umamusume.jp/assets/images/char_detail_image_a_52.png?rel20180223",
      "uploaded": "2018-03-07"
    }
  ],
  "label": "原案",
  "label_en": "Concept Art"
},
{
  "images": [
    {
      "image": "https://images.microcms-assets.io/assets/973fc097984b400db8729642ddff5938/7525a051215a422da3a60e1ad4074d93/admirevega_04.png",
      "uploaded": "2024-02-24"
    },
    {
      "image": "https://web.archive.org/web/20211220142312if_/https://umamusume.jp/app/wp-content/uploads/2021/12/94bd76717e5eec3cbca124ec246c50f6.png",
      "uploaded": "2021-12-20"
    }
  ],
  "label": "<small>STARTING<br>FUTURE</small>",
  "label_en": "Starting Future"
}
]

export function imageMap(imgArr = []) {
  let out = {}
  imgArr.forEach(imageCollection => {
    out[imageCollection.label_en.replaceAll(' ', '_').toLowerCase()] = imageCollection.images.map(imgs => imgs.image)
  })
  return out
}