import {Stack, Flex, Button, Label} from '@sanity/ui'
import {MdImage, MdPlayCircle} from 'react-icons/md'
import {set} from 'sanity'
import styles from './mediaSelector.module.css'
import {useCallback} from 'react'

console.log(styles)

export default function MediaSelector(props) {
  const {
    elementProps: {id, onBlur, onFocus, placeholder, readOnly, ref, value},
    onChange,
    schemaType,
    validation,
    // value = '',
  } = props

  const handleTypeSelect = useCallback(
    (mediaType: 'image' | 'video') => {
      onChange(set({...props.value, mediaType}))
    },
    [onChange],
  )

  const options = [
    {name: 'Image', icon: MdImage},
    {name: 'Video', icon: MdPlayCircle},
  ]

  return (
    <Stack className={styles} space={3}>
      <Label size={2}>Select a media type</Label>
      <Flex gap={3}>
        {options.map((option, index) => (
          <Button
            key={option.name}
            onClick={() => handleTypeSelect(option.name.toLowerCase())}
            icon={option.icon}
            text={option.name}
            mode={
              props?.value?.mediaType.toLowerCase() === option.name.toLowerCase()
                ? 'default'
                : 'ghost'
            }
            fontSize={2}
          />
        ))}
      </Flex>
      <div className={styles.stuff}>{props.renderDefault(props)}</div>
    </Stack>
  )
}
