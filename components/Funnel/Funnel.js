/**
 * Created by hufei on 2017/2/20.
 */
import {
  Clock,
  Color,
  Fog,
  PointLight,
  Mesh,
  PlaneGeometry,
  MeshPhongMaterial,
  CylinderGeometry,
  EdgesHelper,
  FlatShading,
  DoubleSide
} from '../../libs/three.module'
import {Component} from '../../core/Core'

export default class Funnel extends Component {
  constructor(...props) {
    super(props)

    this.clock = new Clock()
    this.scene.add(this.rootGroup)
    this.state = {
      width: 0,
      height: 0
    }
    this.init()
  }

  static get Default() {
    return {
      width: 20,
      height: 20,
      startY: 10,
      gutter: 1,
      data: [0, 0, 0, 0, 0],
      colors: [0x156289, 0x6f60aa, 0x45b97c, 0x00ae9d, 0xfedcbd],
      radiusSegments: 4
    }
  }

  init() {
    this.initPlane()
      .initGeometry()

    this.scene.fog = new Fog(0x23233f, 1, 300000)
    this.camera.position.z = 60
    this.rootGroup.rotation.y = Math.PI * 0.25
    this.rootGroup.rotation.x = Math.PI * 0.062
    this.renderer.setClearColor(new Color(0x000000))
    this.element.appendChild(this.renderer.domElement)
    this.resize()
    this.update(this.clock.startTime)
    return this
  }

  initPlane() {
    let plane = new Mesh(
      new PlaneGeometry(300, 300),
      new MeshPhongMaterial({
        color: 0x000000,
        side: DoubleSide,
        opacity: .95,
        transparent: true
      })
    )
    plane.position.y = -10//this.options.startY - this.options.height
    plane.rotateX(-Math.PI / 2)


    var light = new PointLight(this.options.colors[0], 4, 0);
    light.position.set(0, 100, -60);

    this.scene.add(light)
    this.scene.add(plane)
    return this;
  }

  initGeometry() {
    this.addGeometry()
    return this
  }

  addGeometry() {

    //   radiusTop — 圆柱体顶端半径. 默认值为20.
    //   radiusBottom — 圆柱体底端半径. 默认值为20.
    //   height — 圆柱体高度. 默认值为100.
    //   radiusSegments — 围绕圆柱体周长的分割面数量. 默认值为8.
    //   heightSegments — 沿圆柱体高度的分割面数量. 默认值为1.
    //   openEnded — 指示圆柱体两端是打开还是覆盖的布尔值. 默认值为false, 意思是覆盖.
    //   thetaStart — 第一个分割面的开始角度, 默认值 = 0 (3点钟方向).
    //   thetaLength — 圆形扇形的圆心角通常称为θ。默认为2 * Pi，这形成了一个完整的圆柱体.
    var
      opts = this.options,
      itemLength = opts.data.length,
      itemHeight = (opts.height - (itemLength - 1) * opts.gutter) / itemLength,
      alpha = Math.atan(opts.height / opts.width * 2),
      deltaW = opts.gutter / Math.tan(alpha)

    opts.data.forEach((v, i) => {
      var
        W = opts.width * (itemLength - i) / itemLength,
        w = opts.width * (itemLength - i - 1) / itemLength

      var mesh = new Mesh(new CylinderGeometry(i === 0 ? W : W - deltaW, w > 0 ? w : 0, itemHeight, opts.radiusSegments), new MeshPhongMaterial({
        color: 0x156289,
        emissive: opts.colors[i] || 0x156289,
        opacity: (itemLength - i) / itemLength / 2,
        transparent: true,
        side: DoubleSide,
        shading: FlatShading,
        wireframe: false
      }));
      var edges = new EdgesHelper(mesh, opts.colors[i])
      mesh.position.y = opts.startY - (opts.gutter + itemHeight) * i
      edges.position.y = opts.startY - (opts.gutter + itemHeight) * i
      this.rootGroup.add(mesh)
      this.rootGroup.add(edges)
    })
  }

  update(now) {
    requestAnimationFrame(() => {
      this.update(this.clock.getElapsedTime())
    })

    this.renderer.render(this.scene, this.camera)
  }

}
