import React, {
  useEffect,
  useRef, useState,
} from "react"
import { useLoader, useThree } from "react-three-fiber"
import * as THREE from "three"
import { FontLoader } from "three"
import { randomInt } from "xiaoming-hooks"
import SpriteText from "three-spritetext"
import { CatchableSuspense } from "../CatchableSuspense"

type Land = {
  status: "disabled";
  id: string;
} | {
  status: "occupied";
  id: string;
  tradeInfo: {
    price: number;
  };
  master: {
    id: string;
    name: string;
    avatar: string;
  };
} | {
  status: "tradable";
  id: string;
  tradeInfo: {
    price: number;
  };
};

const WIDTH = 50
const HEIGHT = 50
const CENTER = [2, 1] as [number, number]

const COLOR_MAP: {
  [key in Land["status"]]: number;
} = {
  disabled: 0x999999,
  occupied: 0xffc069,
  tradable: 0x1890ff,
}
const CONTINENT_BACKGROUND_COLOR = 0x999999

interface MapOptions {
  center: [number, number];
  zoom: number;
}

function geneLand(): Land {
  const disabledLandRatio = 0.1
  const occupiedLandRatio = 0.3
  const rand = Math.random()
  const id = rand.toString()
  if (rand < disabledLandRatio) {
    return {
      status: "disabled",
      id,
    }
  }
  if (rand < disabledLandRatio + occupiedLandRatio) {
    return {
      status: "occupied",
      id,
      tradeInfo: {
        price: randomInt(10, 15),
      },
      master: {
        id: randomInt(1, 100).toString().padStart(6, "0"),
        name: `小明-${randomInt(1, 100)}`,
        avatar: "/static/images/avatar.jpg",
      },
    }
  }
  return {
    status: "tradable",
    id,
    tradeInfo: {
      price: randomInt(10, 15),
    },
  }
}

const landList2 = [...new Array(HEIGHT)].map(() => (
  [...new Array(WIDTH)].map(geneLand)
))

const SQRT3 = Math.sqrt(3)
const HALF_SQRT3 = SQRT3 / 2

function pointBetween(start: THREE.Vector2, end: THREE.Vector2, ratio: number) {
  return start.clone().addScaledVector(end.clone().sub(start), ratio)
}

function geneHexagon({
  radius = 1,
  borderRasius = radius / 4,
  direction = "h",
}: {
  radius?: number;
  borderRasius?: number;
  direction?: "h" | "v";
}) {
  const verticies = direction === "h"
    ? [
      [0.5, -HALF_SQRT3],
      [1, 0],
      [0.5, HALF_SQRT3],
      [-0.5, HALF_SQRT3],
      [-1, 0],
      [-0.5, -HALF_SQRT3],
    ].map(([x, y]) => new THREE.Vector2(x * radius, y * radius))
    : [
      [0, -1],
      [HALF_SQRT3, -0.5],
      [HALF_SQRT3, 0.5],
      [0, 1],
      [-HALF_SQRT3, 0.5],
      [-HALF_SQRT3, -0.5],
    ].map(([x, y]) => new THREE.Vector2(x * radius, y * radius))

  const startAngle = direction === "h" ? -Math.PI / 2 : -Math.PI * (2 / 3)
  const stepAngle = Math.PI / 3
  const ratio = borderRasius / radius / SQRT3
  const dblRatio = ratio * 2

  return new THREE.Shape()
    .moveTo(...pointBetween(verticies[0], verticies[5], 0.5).toArray())
    .lineTo(...pointBetween(verticies[0], verticies[5], ratio).toArray())
    .absarc(
      ...pointBetween(verticies[0], new THREE.Vector2(), dblRatio).toArray(),
      borderRasius,
      startAngle,
      startAngle + stepAngle,
      false,
    )
    .lineTo(...pointBetween(verticies[1], verticies[0], ratio).toArray())
    .absarc(
      ...pointBetween(verticies[1], new THREE.Vector2(), dblRatio).toArray(),
      borderRasius,
      startAngle + stepAngle,
      startAngle + stepAngle * 2,
      false,
    )
    .lineTo(...pointBetween(verticies[2], verticies[1], ratio).toArray())
    .absarc(
      ...pointBetween(verticies[2], new THREE.Vector2(), dblRatio).toArray(),
      borderRasius,
      startAngle + stepAngle * 2,
      startAngle + stepAngle * 3,
      false,
    )
    .lineTo(...pointBetween(verticies[3], verticies[2], ratio).toArray())
    .absarc(
      ...pointBetween(verticies[3], new THREE.Vector2(), dblRatio).toArray(),
      borderRasius,
      startAngle + stepAngle * 3,
      startAngle + stepAngle * 4,
      false,
    )
    .lineTo(...pointBetween(verticies[4], verticies[3], ratio).toArray())
    .absarc(
      ...pointBetween(verticies[4], new THREE.Vector2(), dblRatio).toArray(),
      borderRasius,
      startAngle + stepAngle * 4,
      startAngle + stepAngle * 5,
      false,
    )
    .lineTo(...pointBetween(verticies[5], verticies[4], ratio).toArray())
    .absarc(
      ...pointBetween(verticies[5], new THREE.Vector2(), dblRatio).toArray(),
      borderRasius,
      startAngle + stepAngle * 5,
      startAngle + stepAngle * 6,
      false,
    )
}

function Text({ text, sprite = true }: { text: string; sprite?: boolean }) {
  const font = useLoader(FontLoader, "./static/fonts/gentilis_bold.typeface.json")
  const camera = useThree().camera as THREE.OrthographicCamera
  const height = 50 / camera.zoom / 2

  if (sprite) {
    return <spriteText
      args={[text, height, "red"]}
      position={[0, 0, height / 2]}
      ref={(f) => {
        const textSprite = f as SpriteText
        if (textSprite) {
          // padding 计算有误, 不要设置 padding
          textSprite.backgroundColor = "gray"
          textSprite.borderRadius = 2
        }
      }}
    />
  }

  return <shapeGeometry
    ref={(f) => {
      const geometry = f as THREE.ShapeGeometry
      geometry.computeBoundingBox()
      const { boundingBox } = geometry
      if (boundingBox) {
        const xMid = -0.5 * (boundingBox.max.x - boundingBox.min.x)
        geometry.translate(xMid, 0, 0)
      }
    }}
    args={[font.generateShapes(text, height)]}
  />
  // return <textGeometry
  //   args={[text, {
  //     font,
  //     size: 0.1,
  //     height: 0.1,
  //   }]}
  // />
}

function LandItem({
  continentCenter,
  coords,
  land,
}: {
  continentCenter: [number, number];
  coords: [number, number];
  land: Land;
}) {
  const height = 0
  const eps = 0.1
  const gap = 0.04
  const [x, z] = coords
  const [isHover, setIsHover] = useState(false)

  return <>
    <group
      position={[
        x + continentCenter[0] - (WIDTH - 1) / 2 + (z % 2 ? 0.5 : 0),
        height / 2 + eps,
        (z + continentCenter[1] - (HEIGHT - 1) / 2) * (Math.sqrt(3) / 2),
      ]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <mesh
        onClick={(e) => {
          console.log(e)
        }}
        onPointerOver={() => {
          setIsHover(true)
        }}
        onPointerOut={() => {
          setIsHover(false)
        }}
      >
        {/* <cylinderGeometry args={[Math.sqrt(3) / 3, Math.sqrt(3) / 3, height, 6]} /> */}
        <shapeGeometry args={[geneHexagon({ radius: SQRT3 / 3 - gap / 2, direction: "v" })]} />
        <meshPhongMaterial
          color={COLOR_MAP[land.status]}
        />
      </mesh>
      {
        isHover && land.status !== "disabled" && <CatchableSuspense>
          <mesh
            position={[0, 0, 0.1]}
          >
            <Text
              text={
                `${land.status === "occupied"
                  ? `${land.master.name} [$ ${land.tradeInfo.price}]\n(${coords.join(", ")})`
                  : `$ ${land.tradeInfo.price}\n(${coords.join(", ")})`}`
              }
              key={
                `${land.status === "occupied"
                  ? `${land.master.name} [$ ${land.tradeInfo.price}]\n(${coords.join(", ")})`
                  : `$ ${land.tradeInfo.price}\n(${coords.join(", ")})`}`
              }
            />
            <meshPhongMaterial
              color={"red"}
            />
          </mesh>
        </CatchableSuspense>
      }
    </group>
  </>
}

export function Continent() {
  return <>
    {/* background */}
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry args={[50, 50]} />
      <meshBasicMaterial color={CONTINENT_BACKGROUND_COLOR} />
    </mesh>
    {/* land */}
    {
      landList2.map((landList1, z) => landList1.map((land, x) => (<LandItem
        key={land.id}
        continentCenter={CENTER}
        coords={[x, z]}
        land={land}
      />)))
    }
  </>
}
