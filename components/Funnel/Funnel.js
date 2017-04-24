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
  Line3,
  EdgesHelper,
  EdgesGeometry,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  FlatShading,
  Geometry,
  Vector3,
  FontLoader,
  TextGeometry,
  DoubleSide
} from '../../libs/three.module'
import TWEEN from '../../libs/tween'
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
    this.items = []
    this.init()
  }

  static get Default() {
    return {
      width: 20,
      height: 20,
      startY: 10,
      gutter: 1,
      data: [{
        label: "A"
      }, {
        label: "B"
      }, {
        label: "C"
      }, {
        label: "D"
      }, {
        label: "E"
      }],
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
    this.rootGroup.rotation.x = Math.PI * 0.05
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


    this.light = new PointLight(this.options.colors[0], 4, 0);
    this.light.position.set(0, 150, -60);

    this.scene.add(this.light)
    this.scene.add(plane)
    return this
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
      alpha = Math.atan(opts.height / opts.width ),
      deltaW = opts.gutter / Math.tan(alpha)

    opts.data.forEach((v, i) => {
      var
        W = opts.width * (itemLength - i) / itemLength,
        w = opts.width * (itemLength - i - 1) / itemLength,
        y = opts.startY - (opts.gutter + itemHeight) * i - itemHeight / 2
      var mesh = new Mesh(new CylinderGeometry(i === 0 ? W : W - deltaW, w > 0 ? w : 0, itemHeight, opts.radiusSegments), new MeshPhongMaterial({
        color: 0x156289,
        emissive: opts.colors[i] || 0x156289,
        opacity: (itemLength - i) / itemLength / 2,
        transparent: true,
        side: DoubleSide,
        shading: FlatShading,
        wireframe: false
      }))

      var geometry = new Geometry();

      if (i < itemLength - 1) {
        geometry.vertices.push(
          new Vector3(0, y - itemHeight * 1 / 3, W - 2/3*itemHeight/Math.tan(alpha) -1),
          new Vector3(0, y - itemHeight * 1 / 3, W - 2/3*itemHeight/Math.tan(alpha) + 1),
          new Vector3(0, y - itemHeight * 1 / 3, W - 2/3*itemHeight/Math.tan(alpha) + 1),
          new Vector3(0, y - itemHeight * 3 / 2, W - (4/3*itemHeight + opts.gutter)/Math.tan(alpha) + 1),
          new Vector3(0, y - itemHeight * 3 / 2, W - (4/3*itemHeight + opts.gutter)/Math.tan(alpha) + 1),
          new Vector3(0, y - itemHeight * 3 / 2, W - (4/3*itemHeight + opts.gutter)/Math.tan(alpha) -1)
        );
        var material = new MeshPhongMaterial({
          color: opts.colors[i]
        })
        new FontLoader().load('../../assets/fonts/genitilis_bold.typeface.json', (font) => {
          var mesh = new Mesh(new TextGeometry(v.label, {
            font: font,
            size: 1,
            height: 1
          },material));
          mesh.position.z = w +2
          mesh.position.y = y - itemHeight -  opts.gutter + 0.5
          mesh.rotation.y = -0.3*Math.PI
          this.rootGroup.add(mesh)
        })
      }

      var lineT = new LineSegments(geometry, new LineDashedMaterial({color: opts.colors[i], linewidth: 2}))
      var edges = new EdgesGeometry(mesh.geometry)
      var line = new LineSegments(edges, new LineDashedMaterial({color: opts.colors[i], linewidth: 2}));
      mesh.position.y = y
      line.position.y = y
      this.items.push(mesh)
      this.rootGroup.add(mesh)
      this.rootGroup.add(line)
      this.rootGroup.add(lineT)

    })
  }

  update(now) {
    var
      _this = this,
      duration = 1000,
      coords = {y: 6, rotation: 0, thetaLength: 0}

    // //_this.rootGroup.position.y = coords.y
    _this.rootGroup.rotation.y = coords.rotation
    _this.renderer.render(_this.scene, _this.camera)
    var tween = new TWEEN.Tween(coords)
      .to({y: 0, rotation: Math.PI * 0.25, thetaLength: Math.PI * 2}, duration)
      .onUpdate(function () {
        //_this.rootGroup.position.y = this.y
         _this.rootGroup.rotation.y = this.rotation

        // _this.items.forEach((v)=>{
        //   console.log(v.geometry)
        //   v.geometry.thetaLength = this.thetaLength
        // })
        _this.renderer.render(_this.scene, _this.camera)
      })
      .delay(1000)
      .start()

    var _initFrame = (time) => {
      requestAnimationFrame(_initFrame)
      TWEEN.update(time)
    }
    requestAnimationFrame(_initFrame)
  }

}
