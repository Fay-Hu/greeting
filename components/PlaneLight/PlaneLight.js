/**
 * Created by hufei on 2017/2/20.
 */
import {
  Mesh,
  PlaneGeometry,
  MeshPhongMaterial,
  DoubleSide,
  Group,
  PointLight,
  AmbientLight,
  DirectionalLight,
  SphereGeometry,
  MeshBasicMaterial,
  Color,
  Vector3,
  TextGeometry,
  TextureLoader,
  FontLoader,
  Fog,
  Clock,
  SpriteMaterial,
  PointsMaterial,
  Sprite
} from '../../libs/three.module'
import {Component} from '../../core/Core'
import {PlaneLightFrames} from './PlaneLightFrames'

export default class PlaneLight extends Component {
  constructor(...props) {
    super(props)

    this.lights = []
    this.sprites = []
    this.clock = new Clock()

    this.rootGroup.add(this.lightGroup = new Group())
    this.rootGroup.add(this.spriteGroup = new Group())
    this.scene.add(this.rootGroup)
    this.state = {
      width: 0,
      height: 0
    }
    this.init()
  }

  static get Default() {
    return {
      fov: 60,
      //灯光数量
      lightCount: 10,
      spriteCount: 200,
      colors: [
        '54BE68',
        '2CB060',
        '1AA261',
        '0C8D64',
        '037868'
      ],
      //audioUrl: '../../assets/audio/summerLove.mp3'
    }
  }

  init() {
    this
      ._loadImages()
      //._initFonts()
      ._initLights()
      ._initSprite()

    this.scene.fog = new Fog(0x23233f, 1, 300000)
    this.camera.position.z = 100
    this.renderer.setClearColor(new Color(0x11111f))
    this.element.appendChild(this.renderer.domElement)
    this.resize()
    this.update(this.clock.startTime)
    return this
  }


  _loadImages() {

    var timg = new TextureLoader().load('../../assets/textures/timg.jpg')

    var material = new PointsMaterial({map: timg, size: 300})
    var sprite = new Sprite(material);
    this.rootGroup.add(sprite);
    return this
  }

  _initFonts() {
    var _this = this
    var material = new MeshPhongMaterial({
      color: 0x0090ff,
      specular: 0xffff00,
      //指定该材质的光亮程度及其高光部分的颜色，如果设置成和color属性相同的颜色，则会得到另一个更加类似金属的材质，如果设置成grey灰色，则看起来像塑料
      shininess: 0
      //指定高光部分的亮度，默认值为30
    })

    new FontLoader().load('../../assets/fonts/yuweij_medium.typeface.json', function (font) {
      var mesh = new Mesh(new TextGeometry('胡飞', {
        font: font,
        size: 10,
        height: 10
      }), material);
      mesh.position.x = -30
      _this.rootGroup.add(mesh)
    })
    return this
  }

  _initLights() {
    let plane = new Mesh(
      new PlaneGeometry(300, 300),
      new MeshPhongMaterial({
        color: 0x11111f,
        side: DoubleSide,
        opacity: .95,
        transparent: true
      })
    );
    let opts = this.options
    plane.position.y = -8
    plane.rotateX(Math.PI * -.4)
    this.scene.add(plane)

    // Create lights
    for (let i = 0; i < opts.lightCount; i++) {
      const color = parseInt(opts.colors[i % opts.colors.length], 16)
      const light = new PointLight(color, 2, 50)
      light.add(
        new Mesh(
          new SphereGeometry(1, 16, 8),
          new MeshBasicMaterial({color: 0x00ffff})
        )
      )

      this.lights.push(light)
      this.lightGroup.add(light)
    }
    return this
  }

  _initSprite() {
    let len = this.options.spriteCount
    for (let i = 0; i < len; i++) {
      let
        material = new Mesh(
          new SphereGeometry(Math.random() * 1, 16, 8),
          new MeshPhongMaterial({color: 0x00ffff, specular: 0xffffff, shininess: 100})
        )

      var phi = Math.acos(-1 + ( 2 * i ) / len)
      var theta = Math.sqrt(len * Math.PI) * phi
      material.toX = 25 * Math.cos(theta) * Math.sin(phi)
      material.toY = 25 * Math.sin(theta) * Math.sin(phi)
      material.toZ = 25 * Math.cos(phi)
      material.position.set(1, 1, 1)
      this.spriteGroup.add(material)
      this.sprites.push(material)
    }
    var light = new AmbientLight(0x404040); // soft white light
    this.scene.add(light);
    return this
  }

  update(now) {
    requestAnimationFrame(() => {
      this.update(this.clock.getElapsedTime())
    })

    PlaneLightFrames.lights.call(this, now)
    //PlaneLightFrames.sprites.call(this)
    PlaneLightFrames.spriteText.call(this)

    this.renderer.render(this.scene, this.camera)
  }

}
