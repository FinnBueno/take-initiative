import { Image } from '@owlbear-rodeo/sdk'

type Props = {
  image: Image
  width: string
  height: string
}

export const Token = (props: Props) => <img src={props.image.image.url} width={props.width} height={props.height} />
