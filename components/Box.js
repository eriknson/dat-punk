import * as THREE from 'three'
import { useRef, useEffect } from 'react'

let images = {
  back: 'https://gateway.ipfs.io/ipfs/QmRSAsKEKTXgbtEMvUUxrH8rfav4rGXJyzfueYQLwksTQ7',
  bump: 'https://gateway.ipfs.io/ipfs/QmXdmk8bJgCofbY692v2Sfy2j6dyXcqJEsxd92fG4tHUZ1',
  edge: 'https://gateway.ipfs.io/ipfs/QmSUzx2qFy8au1ucrkyH5PLAECtBhEyQrQaZEWRAJ6wB9e',
  front:
    'https://gateway.ipfs.io/ipfs/QmbAf2joK2BXppS5JnWgfMk9azXRdWyYQV117JqRW2Zu3r',
  ribbon:
    'https://gateway.ipfs.io/ipfs/QmPZ8FsQr4W7oHedSnhtyKJuz7w8jXPmEKXqxnG7sQGUee',
  shine:
    'https://gateway.ipfs.io/ipfs/QmRSdGL3iyzPZbq5i6jxxeZD62XoUZ3ijeBTYDuqAiKrgc',
}

const Box = function () {
  const boxTag = useRef()
  const signTag = useRef()

  useEffect(() => {
    let anim
    let wresize
    let wmouse

    if (boxTag.current) {
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      })

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        boxTag.current.clientWidth / boxTag.current.clientHeight,
        0.1,
        500
      )
      camera.position.z = 7.5

      renderer.setSize(boxTag.current.clientWidth, boxTag.current.clientHeight)
      renderer.setClearColor(0x161a25)

      boxTag.current.innerHTML = ''
      boxTag.current.append(renderer.domElement)

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
      scene.add(ambientLight)

      const lightPositions = [
        [-3, 3, 10],
        [0, 3, 10],
        [3, 3, 10],
      ]

      lightPositions.map((p) => {
        const directionalLight = new THREE.DirectionalLight(0xcccccc, 0.2)
        directionalLight.position.set(p[0], p[1], [2])
        scene.add(directionalLight)
      })

      const loader = new THREE.TextureLoader()
      const textures = [
        images.edge,
        images.edge,
        images.edge,
        images.edge,
        images.back,
        images.front,
      ].map((url) => loader.load(url))

      const shine = loader.load(images.shine)
      const bump = loader.load(images.bump)
      const spec = loader.load(images.specular)

      const geometry = new THREE.BoxGeometry(7, 7, 0.1)
      const material = textures.map((t, index) => {
        let options = {
          color: 0xeeeeee,
          emissiveMap: shine,
          bumpMap: bump,
          bumpScale: 0.002,
          map: t,
        }

        return new THREE.MeshPhongMaterial(options)
      })

      const boxGroup = new THREE.Group()
      const box = new THREE.Mesh(geometry, material)
      boxGroup.add(box)
      scene.add(boxGroup)

      boxGroup.rotation.set(-0.1, 0.1, 0.1)

      const cylinderGroup = new THREE.Group()

      let amount = 25
      const cylinders = Array.from(
        { length: amount },
        (x, i) => i - amount / 2
      ).map((i) => {
        const texture = loader.load(images.ribbon)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(3, 1)
        texture.flipY = true

        const geometry = new THREE.CylinderGeometry(15, 15, 2, 128, 8, true)
        const material = new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          map: texture,
        })

        const cylinder = new THREE.Mesh(geometry, [material, material])

        cylinder.position.set(0, i * 2, 0)
        cylinder.userData.sr = Math.random() * Math.PI

        cylinderGroup.add(cylinder)

        scene.add(cylinderGroup)

        return cylinder
      })

      const clock = new THREE.Clock()
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      const easing = (t) => {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
      }

      const animate = () => {
        let t = clock.getElapsedTime()

        let br = t * 0.15
        let bloop = Math.floor(br)
        let capBr = Math.max(0, Math.min(br * 1.5, 1))

        box.rotation.set(0, Math.PI * (easing(br % 1) + bloop), 0)

        cylinders.forEach((cy, i) => {
          let ca = t * 0.03
          let r = i % 2 == 0 ? -1 : 1
          cy.rotation.set(0, ((2 * Math.PI) / 3) * ca * r + i * 0.2, 0)
        })

        boxGroup.position.set(0, -20 + 20 * easing(capBr), 0)
        boxGroup.rotation.set(
          -0.2 * Math.sin(br * 6.5),
          0.2 * Math.sin(br * 5.5),
          0
        )

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects([box])

        if (intersects.length > 0) {
          signTag.current.classList.add('show')
        } else {
          signTag.current.classList.remove('show')
        }

        renderer.render(scene, camera)

        anim = requestAnimationFrame(animate)
      }

      wresize = function () {
        camera.aspect = boxTag.current.clientWidth / boxTag.current.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(
          boxTag.current.clientWidth,
          boxTag.current.clientHeight
        )
      }

      wmouse = function (event) {
        if (boxTag.current && signTag.current) {
          signTag.current.style.left = event.clientX + 'px'
          signTag.current.style.top = event.clientY + 'px'

          mouse.x = (event.clientX / boxTag.current.clientWidth) * 2 - 1
          mouse.y = -(event.clientY / boxTag.current.clientHeight) * 2 + 1
        }
      }

      window.addEventListener('resize', wresize)
      document.addEventListener('mousemove', wmouse)

      animate()
    }

    return () => {
      cancelAnimationFrame(anim)
      window.removeEventListener('resize', wresize)
      document.removeEventListener('mousemove', wmouse)
    }
  }, [boxTag])

  return (
    <div className='cover'>
      <div className='sign' ref={signTag}>
        <span>Just</span>
        <span className='amount'>0.05</span>
        <span>ETH</span>
      </div>
      <div className='box' ref={boxTag}></div>
    </div>
  )
}

export default Box
