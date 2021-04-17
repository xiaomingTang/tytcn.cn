import React, { useEffect } from "react"
import {
  useLoader, useThree, Loader,
} from "react-three-fiber"
import {
  PMREMGenerator, Texture, TextureLoader, WebGLRenderTarget, CubeTextureLoader, DataTexture, CubeTexture,
} from "three"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

export type CubeMapUrl = [[string, string, string, string, string, string]]

function getLoaderFromString(url = ""): new () => Loader<Texture | DataTexture> {
  if (url.endsWith(".hdr") || new URL(url, window.location.href).pathname.endsWith(".hdr")) {
    // @ts-ignore
    return RGBELoader
  }
  return TextureLoader
}

function getLoader(url: string | CubeMapUrl): new () => Loader<Texture | DataTexture | CubeTexture> {
  if (Array.isArray(url)) {
    // @ts-ignore
    return CubeTextureLoader
  }
  return getLoaderFromString(url)
}

/**
 * url 为字符串时: 当作 Equirectangular 处理, 可以是 hdr 或者普通图片
 *
 * url 为 CubeMapUrl 时: 当作 CubeMap 处理, 只能是普通图片
 */
export function useCubeTexture(url: string | CubeMapUrl): Texture {
  const { gl } = useThree()
  const pmremGenerator = new PMREMGenerator(gl)

  if (typeof url === "string") {
    pmremGenerator.compileEquirectangularShader()
  } else {
    pmremGenerator.compileCubemapShader()
  }

  const resultTextures = useLoader(getLoader(url), url as string | string[])
  const texture = Array.isArray(resultTextures) ? resultTextures[0] : resultTextures

  let cubeRenderTarget: WebGLRenderTarget

  if (Array.isArray(url)) {
    cubeRenderTarget = pmremGenerator.fromCubemap(texture as CubeTexture)
  } else {
    cubeRenderTarget = pmremGenerator.fromEquirectangular(texture)
  }

  if (Array.isArray(resultTextures)) {
    resultTextures.forEach((item) => item.dispose())
  } else {
    resultTextures.dispose()
  }

  pmremGenerator.dispose()

  return cubeRenderTarget.texture
}

/**
 * 选择作为 environment 的图片得谨慎, 尽量别选择太亮或太暗的图片, 图片会跟模型发生颜色"交互"
 */
export function EnvMap({ url }: { url: string | CubeMapUrl }) {
  const { scene } = useThree()
  const texture = useCubeTexture(url)

  useEffect(() => {
    if (texture) {
      // 如果为 scene.environment 添加 texture, 会导致物体类似于自发光, 需谨慎
      scene.environment = texture
      // scene.background = texture
    }
  }, [scene, texture])

  return <></>
}
