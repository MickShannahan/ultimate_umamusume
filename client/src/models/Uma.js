export class Uma {
  constructor(data = {}) {
    this.birthDay = data.birth_day;
    this.birthMonth = data.birth_month;
    this.categoryLabel = data.category_label;
    this.categoryLabelEn = data.category_label_en;
    this.categoryValue = data.category_value;
    this.colorMain = data.color_main;
    this.colorSub = data.color_sub;
    this.dateGmt = data.date_gmt;
    this.detailImgPc = data.detail_img_pc;
    this.detailImgSp = data.detail_img_sp;
    this.earsFact = data.ears_fact;
    this.familyFact = data.family_fact;
    this.gameId = data.game_id;
    this.grade = data.grade;
    this.height = data.height;
    this.id = data.id;
    this.link = data.link;
    this.modifiedGmt = data.modified_gmt;
    this.nameEn = data.name_en;
    this.nameEnInternal = data.name_en_internal;
    this.nameJp = data.name_jp;
    this.preferredUrl = data.preferred_url;
    this.profile = data.profile;
    this.residence = data.residence;
    this.rowNumber = data.row_number;
    this.shoeSize = data.shoe_size;
    this.sizeB = data.size_b;
    this.sizeH = data.size_h;
    this.sizeW = data.size_w;
    this.slogan = data.slogan;
    this.snsHeader = data.sns_header;
    this.snsIcon = data.sns_icon;
    this.strengths = data.strengths;
    this.tailFact = data.tail_fact;
    this.thumbImg = data.thumb_img;
    this.voice = data.voice;
    this.weaknesses = data.weaknesses;
    this.weight = data.weight;
    this.pictures = {
      uniform: Array.isArray(data.pictures?.uniform) ? data.pictures.uniform : [],
      racingOutfit: Array.isArray(data.pictures?.racing_outfit) ? data.pictures.racing_outfit : [],
      conceptArt: Array.isArray(data.pictures?.concept_art) ? data.pictures.concept_art : [],
      startingFuture: Array.isArray(data.pictures?.starting_future) ? data.pictures.starting_future : []
    };
  }

  get allImages() {
    const result = {};
    for (const [key, images] of Object.entries(this.pictures)) {
      if (images.length > 0 && images[0]) {
        result[key] = {
          url: images[0],
          text: key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim()
        };
      }
    }
    return result;
  }
}