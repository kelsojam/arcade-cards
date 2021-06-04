namespace SpriteKind {
    export const Card = SpriteKind.create()
}
namespace StrProp {
    export const title = StrProp.create()
    export const description = StrProp.create()
}
namespace ImageProp {
    export const art = ImageProp.create()
}
/**
 * Cards!
 * 
 * Inspiration: Slay the Spire, MtG, 
 * 
 * TODO:
 * 
 * - [x] Define a card
 * 
 *    - Art
 * 
 *    - Name / title
 * 
 *    - stats (TBD)
 * 
 *    - Description (TODO: extension for word wrap)
 * 
 * - [x] Render a card
 * 
 * - [x] Render a hand
 * 
 * - [ ] Traverse a hand
 * 
 * - [ ] Playing a card
 * 
 * - [ ] Render a pile of cards
 * 
 * - [ ] Text wrapping (probably needs an extension)
 * 
 * Extensions used:
 * 
 * =============
 * 
 * jwunderl/pxt-scaling
 * 
 * microsoft/arcade-text
 * 
 * microsoft/arcade-block-objects
 * 
 * jwunderl/arcade-sprite-utils
 */
/**
 * circle x = cos(a) * r + origin_x
 * 
 * circle y = sin(a) * r + origin_y
 */
function setCardHighlight (cardSprite: Sprite, highlight: boolean) {
    cardSprite.setImage(renderSmallCard(sprites.readDataNumber(cardSprite, "id"), sprites.readDataNumber(cardSprite, "rot"), highlight))
}
function renderFullCard (cardId: number, target: Image, highlighted: boolean) {
    cardDef = cardDefinitions[cardId]
    target.fill(12)
    target.drawRect(0, 0, 64, 90, 11)
    target.drawRect(1, 1, 62, 88, 11)
    target.setPixel(0, 0, 0)
    target.setPixel(0, 89, 0)
    target.setPixel(63, 89, 0)
    target.setPixel(63, 0, 0)
    target.setPixel(2, 2, 11)
    target.setPixel(2, 87, 11)
    target.setPixel(61, 87, 11)
    target.setPixel(61, 2, 11)
    if (highlighted) {
        target.replace(11, 5)
    }
    spriteutils.drawTransparentImage(blockObject.getImageProperty(cardDef, ImageProp.art), target, 8, 14)
    titleSprite = textsprite.create(blockObject.getStringProperty(cardDef, StrProp.title), 0, 1)
    titleLeftPad = (64 - titleSprite.width) / 2
    spriteutils.drawTransparentImage(titleSprite.image, target, titleLeftPad, 3)
    titleSprite.destroy()
    descriptionSprite = textsprite.create(blockObject.getStringProperty(cardDef, StrProp.description), 0, 1)
    descriptionSprite.setMaxFontHeight(5)
    spriteutils.drawTransparentImage(descriptionSprite.image, target, 3, 50)
    descriptionSprite.destroy()
}
function createBlankSmallCardImg () {
    return image.create(32, 45)
}
function createBlankFullCardImg () {
    return image.create(64, 90)
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentCardIdx > 0) {
        setCardHighlight(handSprites[currentCardIdx], false)
        currentCardIdx += -1
        setCardHighlight(handSprites[currentCardIdx], true)
    }
})
function renderSmallCard (cardId: number, rotation: number, highlighted: boolean) {
    fullImg = createBlankFullCardImg()
    renderFullCard(cardId, fullImg, highlighted)
    diag = Math.sqrt(32 ** 2 + 45 ** 2)
    return scaling.rot(scaling.scaleHalfX(fullImg), rotation, (diag - 32) / 2)
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentCardIdx < handSprites.length - 1) {
        setCardHighlight(handSprites[currentCardIdx], false)
        currentCardIdx += 1
        setCardHighlight(handSprites[currentCardIdx], true)
    }
})
function createHand () {
    handGap = scene.screenWidth() / (hand.length + 1)
    totalRot = 45
    eaRot = totalRot / (hand.length + 1)
    handSprites = []
    for (let arrayIndex = 0; arrayIndex <= hand.length - 1; arrayIndex++) {
        cardId = hand[arrayIndex]
        rot = arrayIndex * eaRot - totalRot / 2
        mySmallCard = sprites.create(renderSmallCard(cardId, rot, false), SpriteKind.Card)
        mySmallCard.x = Math.cos(spriteutils.degreesToRadians(Math.map(arrayIndex, 0, hand.length - 1, 180, 360))) * 48 + scene.screenWidth() / 2
        mySmallCard.y = Math.sin(spriteutils.degreesToRadians(Math.map(arrayIndex, 0, hand.length - 1, 180, 360))) * 24 + scene.screenHeight()
        sprites.setDataNumber(mySmallCard, "id", cardId)
        sprites.setDataNumber(mySmallCard, "rot", rot)
        handSprites.push(mySmallCard)
    }
}
function defineCard (title: string, art: Image, description: string) {
    card = blockObject.create()
    blockObject.setStringProperty(card, StrProp.title, title)
    blockObject.setImageProperty(card, ImageProp.art, art)
    blockObject.setStringProperty(card, StrProp.description, description)
    cardDefinitions.push(card)
}
let card: blockObject.BlockObject = null
let mySmallCard: Sprite = null
let rot = 0
let cardId = 0
let eaRot = 0
let totalRot = 0
let handGap = 0
let diag = 0
let fullImg: Image = null
let descriptionSprite: TextSprite = null
let titleLeftPad = 0
let titleSprite: TextSprite = null
let cardDef: blockObject.BlockObject = null
let handSprites: Sprite[] = []
let currentCardIdx = 0
let hand: number[] = []
let cardDefinitions: blockObject.BlockObject[] = []
cardDefinitions = []
defineCard("Erasthmus", img`
    777777777777777744447777777777777777777777777777
    7777777777777774ddd44477777777777444447777777777
    7777777677777774ddddd477777777744dddd47777777777
    7777777677777774ddddd44777774444ddddd47777777777
    7777777677777774ddd444411111444dddddd47777777777
    7777776667777774dd44444111114444dddd447777777777
    777777666667777444444444111444444d44477777777777
    7777766666677777444441f4114444444447777777777777
    777766666666777744444ff41141f4444477777777777777
    777766666666677744444441114ff4444447777777777777
    777766666666677744444411111444444447777777777777
    777776666666677744444411ff1144444447777777777777
    777776666666677771114ff1ff11ff444447777777777777
    7777766666667777711114f1331ff4444477777777777777
    7777777777777777711114ff33ff14111477777777777777
    7777777777777777711111113311111114d7777777777777
    7777777777777777411111111111111114d7777777777777
    7777777777777774411111111111111114d7777777777777
    7777777777777774411111111111111144d7777777777777
    7777777777777774411111111111111144d4477777777777
    7777777777777774441111111111111144d4447777777777
    7777777777777777444111111111111444d4444477777777
    777777777777777744dd111111111dd444d4444447777777
    777777777777777774d441111111ddd44d44444447777777
    777777777777777774d44411111dd4d44d44444447777777
    777777777777777777d44471117d44d44d44444447777777
    777777777777777777444477177444444444144477777777
    777777777777777777111177777111144471111777777777
    777777777777777777111177777111144471117777777777
    77777777777777777111117777111117777b7b7777777777
    777777777777777771111777771111777777777777777777
    77777777777777777b.b777777b.b7777777777777777777
    `, "It is very large, likes orange, but not the fruit!")
defineCard("Tetra Odd", img`
    999999999999999999992999999999999999999999999999
    999999999999999999922999999922999999999999999999
    999999999999999999222999992222999999999999999999
    999988899999999999444444444442999999888889999999
    999989899999999944444444244444499929899989999999
    999988899922999442244444224444449229899989999999
    999999999992224444224444224444442299899989999999
    99999999999224fff4222444222444444299888889999999
    9999999999994f4444244444444444444449999999999999
    999999999994444444442244444444444444999999999999
    999999999994444444442224444444222224999555499999
    999999999944411114442422444444222244495544999999
    99999992224441ff14442442444444222444455444999999
    99999992224441f114444444444444422444444444999999
    999999992244411114444444455544444444444444999999
    999999999944411144444444444555444444444449999999
    999999999944444444444444444445442244444449999999
    999999999944444444ff4444444445444224444449999999
    99999999994444444ff44244554445444422444449999999
    9999999999ff4444ff444244455455442224444444889999
    99999999884ffffff4422244445554444444444444989999
    999999998944555544444444242444444555454444889999
    999999998884555552544444224244455555955544499999
    999999999994455222255555522555554554999554499999
    999999999999455222555555555555555529999955499999
    999999999999945555555555555555552222888999999999
    999999999999994425555555555555554222898999999999
    999999999999999222552555555522249992888999999999
    999999999999992224422252225522229999999999999999
    999988899999992299422442244442229999999999999999
    999989899999999999922992288889229999999999999999
    999988899999999999929992999999999999999999999999
    `, "Very spiky!")
defineCard("Hat Horder", img`
    666666666666666666666666111666666666666666666666
    6666666666666666666666611bb116666666666666666666
    666666666666666666666661111111666666666666666666
    666666666666666666666661b111b1666666666666666666
    66666666666666666666611b1111b1666666666666666666
    666666666666666666661111b1b116666666666666666666
    66666666666666666666ff111b1166666666666666666666
    66666666666666666666fff1116666666666666666666666
    66666666666666666666ffff166666666666666666666666
    66666666666666666666fffff66666666666666666666666
    66666666666666666666fffffff666666666666666666666
    666666666666666666fffffff11166666666666666666666
    666666666666666666661111191166666666666666666666
    666666666666666666666bbc119116666666666666666666
    666666666666666666666bcbbb1911166666666666666666
    66666666666666666666ccccccc111166666666666166666
    666661661666666666bbbbbbbbbbb9999666666166666166
    666616666166666666666662222266999966666616161666
    666661661666666666666622222222296666666611111666
    6666611116666666666666222222222666666666f11f1166
    66661f111f666666666666fffffff6666666666611111616
    6666111f116666666666fffffffffff6666666661ff11616
    666611f1f1666666666666cc1ffc16666666666661116166
    6666611116666666666666eeeeeee6666666611111111666
    66611111116666666666eeeeeeeeeee66666666661116666
    6666611116666666666eeceeeeeeecee6666666661116666
    6666611116666666666eecceeeeeccee6666666661116666
    6666611116666666666eeeccccccccee6666666661116666
    6666611116666666666666eec6eec6666666666661616666
    6666616616666666666666eec6eec6666666666666666666
    6666616666666666666666eec6eec6666666666666666666
    666666666666666666666eecc6eeec666666666666666666
    `, "Hold onto your hats! Hat Horder is coming...")
hand = []
for (let index = 0; index < 7; index++) {
    hand.push(randint(0, cardDefinitions.length - 1))
}
createHand()
currentCardIdx = 0
setCardHighlight(handSprites[currentCardIdx], true)
