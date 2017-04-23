/**
 * Created by hufei on 2017/4/6.
 */
let PlaneLightFrames = {
  lights:function(now){
    this.lights.forEach((light, index) => {
      light.position.y = Math.cos((now * (index * 0.5 + 1))) * (58)
      light.position.x = Math.sin((now * (index * 0.5 + 1))) * (5 + index * 4)
      light.position.z = Math.cos((now * (index * 0.5 + 1))) * (5 + index * 4)
    })
  },
  sprites:function(){
    this.sprites.forEach((sprite, index) => {
      this.spriteGroup.children[index].position.x += (sprite.toX - this.spriteGroup.children[index].position.x ) * 0.03
      this.spriteGroup.children[index].position.y += (sprite.toY - this.spriteGroup.children[index].position.y ) * 0.03
      this.spriteGroup.children[index].position.z += (sprite.toZ - this.spriteGroup.children[index].position.z ) * 0.03
    })
  },
  spriteText:function(){
    this.sprites.forEach((sprite, index) => {
      this.spriteGroup.children[index].position.x += (sprite.toX - this.spriteGroup.children[index].position.x ) * 0.03
      this.spriteGroup.children[index].position.y += (sprite.toY - this.spriteGroup.children[index].position.y ) * 0.03
      this.spriteGroup.children[index].position.z += (sprite.toZ - this.spriteGroup.children[index].position.z ) * 0.03
    })
  }
}

export {
  PlaneLightFrames
}