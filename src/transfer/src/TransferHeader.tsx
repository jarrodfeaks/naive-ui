import type { PropType, VNodeChild } from 'vue'
import { defineComponent, h, inject } from 'vue'
import { useLocale } from '../../_mixins'
import { NButton } from '../../button'
import { transferInjectionKey } from './interface'

export default defineComponent({
  name: 'TransferHeader',
  props: {
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      required: true
    },
    selectAllText: String,
    clearText: String,
    sourceTotalItemsText: String,
    targetSelectedItemsText: String,
    source: Boolean,
    onCheckedAll: Function as PropType<() => void>,
    onClearAll: Function as PropType<() => void>,
    title: [String, Function] as PropType<string | (() => VNodeChild)>
  },
  setup(props) {
    const {
      targetOptionsRef,
      canNotSelectAnythingRef,
      canBeClearedRef,
      allCheckedRef,
      mergedThemeRef,
      disabledRef,
      mergedClsPrefixRef,
      srcOptionsLengthRef
    } = inject(transferInjectionKey)!
    const { localeRef } = useLocale('Transfer')
    return () => {
      const {
        source,
        onClearAll,
        onCheckedAll,
        selectAllText,
        clearText,
        sourceTotalItemsText,
        targetSelectedItemsText
      } = props
      const { value: mergedTheme } = mergedThemeRef
      const { value: mergedClsPrefix } = mergedClsPrefixRef
      const { value: locale } = localeRef
      const buttonSize = props.size === 'large' ? 'small' : 'tiny'
      const { title } = props
      return (
        <div class={`${mergedClsPrefix}-transfer-list-header`}>
          {title && (
            <div class={`${mergedClsPrefix}-transfer-list-header__title`}>
              {typeof title === 'function' ? title() : title}
            </div>
          )}
          {source && (
            <NButton
              class={`${mergedClsPrefix}-transfer-list-header__button`}
              theme={mergedTheme.peers.Button}
              themeOverrides={mergedTheme.peerOverrides.Button}
              size={buttonSize}
              tertiary
              onClick={allCheckedRef.value ? onClearAll : onCheckedAll}
              disabled={canNotSelectAnythingRef.value || disabledRef.value}
            >
              {{
                default: () =>
                  allCheckedRef.value
                    ? clearText || locale.unselectAll
                    : selectAllText || locale.selectAll
              }}
            </NButton>
          )}
          {!source && canBeClearedRef.value && (
            <NButton
              class={`${mergedClsPrefix}-transfer-list-header__button`}
              theme={mergedTheme.peers.Button}
              themeOverrides={mergedTheme.peerOverrides.Button}
              size={buttonSize}
              tertiary
              onClick={onClearAll}
              disabled={disabledRef.value}
            >
              {{
                default: () => locale.clearAll
              }}
            </NButton>
          )}
          <div class={`${mergedClsPrefix}-transfer-list-header__extra`}>
            {source
              ? sourceTotalItemsText || locale.total(srcOptionsLengthRef.value)
              : targetSelectedItemsText
                || locale.selected(targetOptionsRef.value.length)}
          </div>
        </div>
      )
    }
  }
})
