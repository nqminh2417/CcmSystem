import { Checkbox, List, useTheme } from 'react-native-paper';

import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
    label: string;
    subLabel?: string;
    selected: boolean;
    multiple: boolean;
    onPress: () => void;
};

export const SelectionListItem: React.FC<Props> = ({
    label,
    subLabel,
    selected,
    multiple,
    onPress,
}) => {
    const theme = useTheme();
    const hasSubLabel = !!subLabel;

    return (
        <List.Item
            onPress={onPress}
            title={label}
            description={hasSubLabel ? subLabel : undefined}
            titleNumberOfLines={2}
            descriptionNumberOfLines={2}
            rippleColor={theme.colors.surfaceVariant}
            style={[
                styles.item,
                {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: theme.colors.outlineVariant,
                },
                selected && {
                    backgroundColor: theme.colors.secondaryContainer,
                    borderRadius: 8,
                    borderBottomWidth: 0,
                    marginBottom: 4,
                },
            ]}
            titleStyle={{
                fontSize: 16,
                fontWeight: selected ? '700' : '500',
            }}
            descriptionStyle={
                hasSubLabel
                    ? {
                        fontSize: 12,
                        color: theme.colors.onSurfaceVariant,
                    }
                    : undefined
            }
            right={props =>
                multiple ? (
                    <Checkbox
                        status={selected ? 'checked' : 'unchecked'}
                        onPress={onPress}
                    />
                ) : selected ? (
                    <List.Icon {...props} icon="check" />
                ) : null
            }
        />
    );
};

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 0,
    },
});
