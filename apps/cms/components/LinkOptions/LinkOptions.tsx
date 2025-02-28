import {Stack, Flex, Button, TabList, Tab, Select, Box} from '@sanity/ui'
import {MdEmail, MdLink, MdPhone} from 'react-icons/md'
import {MemberField, set} from 'sanity'
import {CgExternal} from 'react-icons/cg'
import styles from './link-options.module.css'
import {useCallback, useEffect, useState} from 'react'

export default function LinkOptions(props) {
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
    {name: 'Page', value: 'internal', icon: MdLink},
    {name: 'URL', value: 'external', icon: CgExternal},
  ]

  return (
    <Stack className={styles} space={3}>
      {/* <Flex gap={3}>
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
      </Flex> */}
      <TabList space={2}>
        {options.map((option, index) => (
          <Tab
            defaultChecked={props?.value?.linkType === option.value}
            // tone={props?.value?.linkType === option.value ? 'primary' : 'default'}
            selected={props?.value?.linkType === option.value}
            onClick={() => handleTypeSelect(option.value)}
            label={option.name}
            icon={option.icon}
            key={option.name}
            value={option.value}
          />
        ))}
      </TabList>
      {/* <Flex gap={2}>
        <Select>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </Select>
      </Flex> */}
      <Flex direction="column" gap={4}>
        {members.slice(2).map((member, index) => (
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
