import {Stack, Flex, Button} from '@sanity/ui'
import {MdLink} from 'react-icons/md'
import {MemberField, set} from 'sanity'
import {CgExternal} from 'react-icons/cg'
import styles from './MediaSelector/mediaSelector.module.css'
import {useCallback, useEffect, useState} from 'react'

export default function LinkTypeSelector(props) {
  const [tabOptions, setTabOptions] = useState([])
  const {
    elementProps: {id, onBlur, onFocus, placeholder, readOnly, ref, value},
    onChange,
    schemaType,
    validation,
    renderField,
    renderInput,
    members,
    renderItem,
    renderPreview,
    // value = '',
  } = props

  // const hasLabel = !schemaType?.options?.noLabel

  const handleTypeSelect = useCallback(
    async (linkType: string) => {
      onChange(set({...props.value, linkType}))
      // await getReferencedPageData()
    },
    [onChange],
  )

  const options = [
    {name: 'Internal Link', value: 'internal', icon: MdLink},
    {name: 'External Link', value: 'external', icon: CgExternal},
  ]

  return (
    <Stack className={styles} space={3}>
      <Flex gap={3}>
        {options.map((option, index) => (
          <Button
            key={option.name}
            onClick={() => handleTypeSelect(option.value)}
            icon={option.icon}
            text={option.name}
            mode={props?.value?.linkType?.toLowerCase() === option.value ? 'default' : 'ghost'}
            fontSize={2}
          />
        ))}
      </Flex>

      <Flex direction="column" gap={4}>
        {members.slice(1).map((member, index) => (
          <MemberField
            renderInput={renderInput}
            renderField={renderField}
            renderItem={renderItem}
            renderPreview={renderPreview}
            key={index}
            member={member}
          />
        ))}
      </Flex>
    </Stack>
  )
}
